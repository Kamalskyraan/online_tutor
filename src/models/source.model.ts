import axios from "axios";

import {
  languageFilter,
  languageUpdate,
  LocationInput,
  LocationResult,
  PincodeDB,
  PincodeResult,
} from "../interface/interface";
import {
  convertNullToString,
  executeQuery,
  safeJSONParse,
} from "../utils/helper";

export class SourceModel {
  async getLatLngFromPincode(
    pincode: string,
    icountry: string,
  ): Promise<PincodeResult | null> {
    try {
      const normalize = (val: string) => val?.trim().toLowerCase();
      const rows: PincodeDB[] = await executeQuery(
        `SELECT * FROM pincode_details_from_pincode WHERE pincode = ?`,
        [pincode],
      );

      if (rows.length > 0) {
        const r = rows[0];

        if (r.country?.trim().toLowerCase() !== normalize(icountry)) {
          return null;
        }
        return {
          pincode: r.pincode,
          postcode_localities: safeJSONParse(r.postcode_localities),
          city: r.city ? r.city : r.state ? r.state : "",
          district: r.district ? r.district : r.state ? r.state : "",
          state: r.state ?? "",
          country: r.country ?? "",
          lat: r.lat ?? 0,
          lng: r.lng ?? 0,
          formatted_address: r.formatted_address ?? "",
        };
      }

      const resp = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: `${pincode}`,
            key: process.env.GOOGLE_MAPS_API_KEY,
          },
        },
      );

      if (resp.data.status !== "OK" || !resp.data.results?.length) {
        return null;
      }

      const result = resp.data.results[0];

      const geometry = result.geometry?.location;
      if (!geometry) return null;

      let city = "";
      let district = "";
      let state = "";
      let country = "";

      (result.address_components || []).forEach((c: any) => {
        if (c.types.includes("locality") || c.types.includes("postal_town"))
          city = c.long_name;
        if (c.types.includes("administrative_area_level_3"))
          district = c.long_name;
        if (c.types.includes("administrative_area_level_1"))
          state = c.long_name;
        if (c.types.includes("country")) country = c.long_name;
      });

      if (country.trim().toLowerCase() !== icountry.trim().toLowerCase())
        return null;

      if (!city) {
        city = state;
      }

      if (!district) {
        district = state;
      }

      const postcode_localities: string[] = result.postcode_localities || [];
      const formattedAddress = result.formatted_address || "";

      await executeQuery(
        `INSERT INTO pincode_details_from_pincode
         (pincode, postcode_localities, city, district, state, country, lat, lng, formatted_address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pincode,
          JSON.stringify(postcode_localities),
          city ? city : state,
          district ? district : state,
          state,
          country,
          geometry.lat,
          geometry.lng,
          formattedAddress,
        ],
      );

      return {
        pincode,
        postcode_localities,
        city,
        district,
        state,
        country,
        lat: geometry.lat,
        lng: geometry.lng,
        formatted_address: formattedAddress,
      };
    } catch (err) {
      console.error("getLatLngFromPincode error:", err);
      return null;
    }
  }
  async updateEducationLevel(id: number, name: string): Promise<number> {
    const result: any = await executeQuery(
      `UPDATE education_level SET name = ? WHERE id = ?`,
      [name, id],
    );

    return result.affectedRows;
  }
  async addEducationLevel(name: string): Promise<number> {
    const result: any = await executeQuery(
      `INSERT INTO education_level (name) VALUES (?)`,
      [name],
    );
    return result.insertId;
  }

  async getEducationLevelById(id: number) {
    const rows: any = await executeQuery(
      `SELECT id, name FROM education_level WHERE id = ?`,
      [id],
    );
    return rows.length ? rows[0] : null;
  }
  async addStream(edu_id: number, name: string) {
    await executeQuery(
      `INSERT INTO education_stream (edu_id, name)
       VALUES (?, ?)`,
      [edu_id, name],
    );
  }

  async updateStream(id: number, edu_id: number, name: string) {
    const result: any = await executeQuery(
      `UPDATE education_stream
       SET edu_id = ?, name = ?
       WHERE id = ?`,
      [edu_id, name, id],
    );

    return result.affectedRows;
  }
  async getStreamsByEduId(edu_id: number) {
    return await executeQuery(
      `SELECT s.id, s.edu_id, s.name , l.name 
       FROM education_stream s
       LEFT JOIN education_level l ON l.id = s.edu_id
       WHERE s.edu_id = ?`,
      [edu_id],
    );
  }
  async getAllStreams() {
    return await executeQuery(
      `SELECT s.id, s.edu_id, s.name , l.name 
       FROM education_stream s
       LEFT JOIN education_level l ON l.id = s.edu_id`,
      [],
    );
  }

  async fetchCountryCode(search?: string) {
    let query = `SELECT country, iso3, phonecode, currency_symbol, currency_name FROM country`;
    const params: any[] = [];
    if (search) {
      query += ` WHERE country = ? OR phonecode = ? LIMIT 1`;
      params.push(search, search);
    }
    const result: any[] = await executeQuery(query, params);
    return result;
  }
  async createAndUpdate(data: languageUpdate) {
    const { id, lang_name, status } = data;

    if (id) {
      const fields: string[] = [];
      const values: any[] = [];

      if (lang_name) {
        fields.push("lang_name = ?");
        values.push(lang_name);
      }

      if (status) {
        fields.push("status = ?");
        values.push(status);
      }

      if (fields.length === 0) {
        throw new Error("No fields provided to update");
      }

      values.push(id);

      const query = `UPDATE languages SET ${fields.join(", ")} WHERE id = ?`;

      const result = await executeQuery(query, values);

      return { type: "update", result };
    }

    const query = `
    INSERT INTO languages (lang_name, status)
    VALUES (?, ?)
  `;

    const result = await executeQuery(query, [lang_name, status || "active"]);

    return { type: "insert", result };
  }

  async fetchLanguages({ id, lang_name, status }: languageFilter) {
    let query = `SELECT id , lang_name , status FROM languages WHERE 1=1`;
    const values: any[] = [];

    if (id) {
      query += ` AND id = ?`;
      values.push(id);
    }

    if (lang_name) {
      query += ` AND lang_name LIKE ?`;
      values.push(`%${lang_name}%`);
    }

    if (status) {
      query += ` AND status = ?`;
      values.push(status);
    }

    const result = await executeQuery(query, values);

    return result;
  }

  async fetchLatLangFromQuery(query: string): Promise<LocationResult[] | null> {
    try {
      if (!query) return [];

      const dbResults: any = await executeQuery(
        `
      SELECT * FROM pincode_details
      WHERE 
        postcode_localities LIKE ? OR
        city LIKE ? OR
        district LIKE ? OR
        state LIKE ? OR
        formatted_address LIKE ?
      LIMIT 10
      `,
        [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`],
      );

      if (dbResults.length > 0) {
        return convertNullToString(dbResults);
      }

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;

      const suggestUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&components=country:in&key=${apiKey}`;

      const suggestResp = await axios.get(suggestUrl);

      if (
        suggestResp.data.status !== "OK" ||
        !suggestResp.data.predictions?.length
      ) {
        return [];
      }

      const results: LocationResult[] = [];

      await Promise.all(
        suggestResp.data.predictions
          .slice(0, 5)
          .map(async (prediction: any) => {
            const placeId = prediction.place_id;
            if (!placeId) return;

            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
            const detailsResp = await axios.get(detailsUrl);

            if (detailsResp.data.status !== "OK") return;

            const place = detailsResp.data.result;
            const components = place.address_components || [];

            const getComp = (type: string): string | null =>
              components.find((c: any) => c.types.includes(type))?.long_name ||
              null;

            const country = getComp("country");
            if (!country || country.toLowerCase() !== "india") return;

            const pincode = getComp("postal_code");

            const resultObj = {
              pincode,
              postcode_localities:
                getComp("sublocality") || getComp("locality"),
              city:
                getComp("locality") || getComp("administrative_area_level_2"),
              district: getComp("administrative_area_level_2"),
              state: getComp("administrative_area_level_1"),
              country,
              lat: place.geometry?.location?.lat || null,
              lng: place.geometry?.location?.lng || null,
              formatted_address: place.formatted_address || null,
            };

            if (pincode) {
              const existing: any = await executeQuery(
                `SELECT id FROM pincode_details WHERE pincode = ? LIMIT 1`,
                [pincode],
              );

              if (existing.length === 0) {
                await executeQuery(
                  `
              INSERT INTO pincode_details
              (pincode, postcode_localities, city, district, state, country, lat, lng, formatted_address)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `,
                  [
                    pincode,
                    resultObj.postcode_localities,
                    resultObj.city,
                    resultObj.district,
                    resultObj.state,
                    resultObj.country,
                    resultObj.lat,
                    resultObj.lng,
                    resultObj.formatted_address,
                  ],
                );
              }
            }

            results.push(resultObj);
          }),
      );

      const uniqueResults = Array.from(
        new Map(
          results.map((r) => [r.pincode || r.formatted_address, r]),
        ).values(),
      );

      return convertNullToString(uniqueResults);
    } catch (err: any) {
      console.error("Error:", err.message);
      return null;
    }
  }
}
