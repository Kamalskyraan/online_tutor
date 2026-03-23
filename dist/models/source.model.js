"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceModel = void 0;
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("../utils/helper");
class SourceModel {
    async getLatLngFromPincode(pincode) {
        try {
            const rows = await (0, helper_1.executeQuery)(`SELECT * FROM pincode_details_from_pincode WHERE pincode = ?`, [pincode]);
            if (rows.length > 0) {
                const r = rows[0];
                return {
                    pincode: r.pincode,
                    postcode_localities: (0, helper_1.safeJSONParse)(r.postcode_localities),
                    city: r.city ?? "",
                    district: r.district ?? "",
                    state: r.state ?? "",
                    country: r.country ?? "",
                    lat: r.lat ?? 0,
                    lng: r.lng ?? 0,
                    formatted_address: r.formatted_address ?? "",
                };
            }
            const resp = await axios_1.default.get("https://maps.googleapis.com/maps/api/geocode/json", {
                params: {
                    address: `${pincode}, India`,
                    key: process.env.GOOGLE_MAPS_API_KEY,
                },
            });
            if (resp.data.status !== "OK" || !resp.data.results?.length) {
                return null;
            }
            const result = resp.data.results[0];
            const geometry = result.geometry?.location;
            if (!geometry)
                return null;
            let city = "";
            let district = "";
            let state = "";
            let country = "";
            (result.address_components || []).forEach((c) => {
                if (c.types.includes("locality") || c.types.includes("postal_town"))
                    city = c.long_name;
                if (c.types.includes("administrative_area_level_3"))
                    district = c.long_name;
                if (c.types.includes("administrative_area_level_1"))
                    state = c.long_name;
                if (c.types.includes("country"))
                    country = c.long_name;
            });
            if (country.toLowerCase() !== "india")
                return null;
            const postcode_localities = result.postcode_localities || [];
            const formattedAddress = result.formatted_address || "";
            await (0, helper_1.executeQuery)(`INSERT INTO pincode_details_from_pincode
         (pincode, postcode_localities, city, district, state, country, lat, lng, formatted_address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                pincode,
                JSON.stringify(postcode_localities),
                city,
                district,
                state,
                country,
                geometry.lat,
                geometry.lng,
                formattedAddress,
            ]);
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
        }
        catch (err) {
            console.error("getLatLngFromPincode error:", err);
            return null;
        }
    }
    async updateEducationLevel(id, name) {
        const result = await (0, helper_1.executeQuery)(`UPDATE education_level SET name = ? WHERE id = ?`, [name, id]);
        return result.affectedRows;
    }
    async addEducationLevel(name) {
        const result = await (0, helper_1.executeQuery)(`INSERT INTO education_level (name) VALUES (?)`, [name]);
        return result.insertId;
    }
    async getEducationLevelById(id) {
        const rows = await (0, helper_1.executeQuery)(`SELECT id, name FROM education_level WHERE id = ?`, [id]);
        return rows.length ? rows[0] : null;
    }
    async addStream(edu_id, name) {
        await (0, helper_1.executeQuery)(`INSERT INTO education_stream (edu_id, name)
       VALUES (?, ?)`, [edu_id, name]);
    }
    async updateStream(id, edu_id, name) {
        const result = await (0, helper_1.executeQuery)(`UPDATE education_stream
       SET edu_id = ?, name = ?
       WHERE id = ?`, [edu_id, name, id]);
        return result.affectedRows;
    }
    async getStreamsByEduId(edu_id) {
        return await (0, helper_1.executeQuery)(`SELECT s.id, s.edu_id, s.name , l.name 
       FROM education_stream s
       LEFT JOIN education_level l ON l.id = s.edu_id
       WHERE s.edu_id = ?`, [edu_id]);
    }
    async getAllStreams() {
        return await (0, helper_1.executeQuery)(`SELECT s.id, s.edu_id, s.name , l.name 
       FROM education_stream s
       LEFT JOIN education_level l ON l.id = s.edu_id`, []);
    }
    async fetchCountryCode(search) {
        let query = `SELECT country, iso3, phonecode, currency_symbol, currency_name FROM country`;
        const params = [];
        if (search) {
            query += ` WHERE country = ? OR phonecode = ? LIMIT 1`;
            params.push(search, search);
        }
        const result = await (0, helper_1.executeQuery)(query, params);
        return result;
    }
    async createAndUpdate(data) {
        const { id, lang_name, status } = data;
        if (id) {
            const fields = [];
            const values = [];
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
            const result = await (0, helper_1.executeQuery)(query, values);
            return { type: "update", result };
        }
        const query = `
    INSERT INTO languages (lang_name, status)
    VALUES (?, ?)
  `;
        const result = await (0, helper_1.executeQuery)(query, [lang_name, status || "active"]);
        return { type: "insert", result };
    }
    async fetchLanguages({ id, lang_name, status }) {
        let query = `SELECT id , lang_name , status FROM languages WHERE 1=1`;
        const values = [];
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
        const result = await (0, helper_1.executeQuery)(query, values);
        return result;
    }
}
exports.SourceModel = SourceModel;
//# sourceMappingURL=source.model.js.map