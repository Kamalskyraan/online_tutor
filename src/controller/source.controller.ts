import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import { SourceModel } from "../models/source.model";
import {
  addUpdateLangSchema,
  educationSchema,
  educationStreamSchema,
} from "../validators/validate";
import axios from "axios";
import { LocationInput, LocationResult } from "../interface/interface";
const sourceModel = new SourceModel();
export class SourceController {
  static getAdressDetailsFromPincode = async (req: Request, res: Response) => {
    try {
      const { pincode, icountry } = req.body;
      if (!pincode) {
        return sendResponse(res, 200, 0, [], "Pincode is required");
      }
      if (!icountry) {
        return sendResponse(res, 200, 0, [], "Country is required");
      }

      const data = await sourceModel.getLatLngFromPincode(pincode, icountry);
      if (!data) {
        return sendResponse(res, 200, 0, [], "Pincode not found");
      }
      return sendResponse(
        res,
        200,
        1,
        [data],
        "Address fetched successfully from pincode",
      );
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        "Something went wrong",
        err.errors || err.message || err,
      );
    }
  };
  static addUpdateEducationLevel = async (req: Request, res: Response) => {
    try {
      const { id, name } = await validateRequest(req.body, educationSchema);
      if (id) {
        await sourceModel.updateEducationLevel(id, name);
        return sendResponse(
          res,
          200,
          1,
          [],
          "Education level updated successfully",
        );
      } else {
        await sourceModel.addEducationLevel(name);
        return sendResponse(
          res,
          201,
          1,
          [],
          "Education level added successfully",
        );
      }
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        "Something went wrong",
        err.errors || err.message || err,
      );
    }
  };
  static addUpdateStream = async (req: Request, res: Response) => {
    try {
      const { id, edu_id, name } = await validateRequest(
        req.body,
        educationStreamSchema,
      );
      const level = await sourceModel.getEducationLevelById(edu_id);

      if (!level) {
        return sendResponse(res, 200, 0, [], "Education level not found");
      }

      if (id) {
        await sourceModel.updateStream(id, edu_id, name);
        return sendResponse(res, 200, 1, [], "Stream updated successfully");
      } else {
        await sourceModel.addStream(edu_id, name);
        return sendResponse(res, 200, 1, [], "Stream added successfully");
      }
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        "Something went wrong",
        err.errors || err.message || err,
      );
    }
  };
  static getStreamsByEducation = async (req: Request, res: Response) => {
    try {
      const { edu_id } = req.body;
      let streams;
      if (edu_id) {
        streams = await sourceModel.getStreamsByEduId(edu_id);
      } else {
        streams = await sourceModel.getAllStreams();
      }
      return sendResponse(res, 200, 1, streams, "Streams fetched successfully");
    } catch (err: any) {
      return sendResponse(
        res,
        err.status || 500,
        0,
        [],
        "Something went wrong",
        err.errors || err.message || err,
      );
    }
  };
  static getCountryData = async (req: Request, res: Response) => {
    try {
      const { search } = req.body;
      const result = await sourceModel.fetchCountryCode(search);
      return sendResponse(
        res,
        200,
        1,
        result,
        "Country Data Fetched successfully",
      );
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "something went wrong",
        err.errors || err.message || err,
      );
    }
  };
  //lan
  static addUpdateLanguage = async (req: Request, res: Response) => {
    try {
      const { id, lang_name, status } = await validateRequest(
        req.body,
        addUpdateLangSchema,
      );

      const data = await sourceModel.createAndUpdate({
        id,
        lang_name,
        status,
      });

      const message =
        data.type === "insert"
          ? "Language added successfully"
          : "Language updated successfully";

      return sendResponse(res, 200, 1, [], message, []);
    } catch (err: any) {
      console.log(err);
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  };

  static getLanguages = async (req: Request, res: Response) => {
    try {
      const { id, lang_name, status } = req.body;

      const langData = await sourceModel.fetchLanguages({
        id,
        lang_name,
        status,
      });
      return sendResponse(
        res,
        200,
        1,
        langData,
        "Language Data fetched successfully",
        [],
      );
    } catch (err: any) {
      sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  };
}

// static getLatLangFromArea = async (
//   input: LocationInput,
// ): Promise<LocationResult[] | null> => {
//   try {
//     const { area, city, state } = input;

//     const query = [area, city, state].filter(Boolean).join(", ");
//     if (!query) return [];

//     const apiKey = process.env.GOOGLE_MAPS_API_KEY;

//     const suggestUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
//       query,
//     )}&key=${apiKey}`;

//     const suggestResp = await axios.get(suggestUrl);

//     if (
//       suggestResp.data.status !== "OK" ||
//       !suggestResp.data.predictions?.length
//     ) {
//       return [];
//     }

//     const results: LocationResult[] = [];

//     await Promise.all(
//       suggestResp.data.predictions.map(async (prediction: any) => {
//         const placeId = prediction.place_id;
//         if (!placeId) return;

//         const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
//         const detailsResp = await axios.get(detailsUrl);

//         if (detailsResp.data.status !== "OK" || !detailsResp.data.result) {
//           return;
//         }

//         const place = detailsResp.data.result;
//         const components = place.address_components || [];

//         const getComp = (type: string): string | null =>
//           components.find((c: any) => c.types.includes(type))?.long_name ||
//           null;

//         const countryObj = components.find((c: any) =>
//           c.types.includes("country"),
//         );

//         const countryLong = countryObj?.long_name || null;
//         const countryShort = countryObj?.short_name || null;

//         if (
//           !countryObj ||
//           countryLong?.toLowerCase() !== "india" ||
//           countryShort?.toLowerCase() !== "in"
//         ) {
//           return;
//         }

//         const pincode = getComp("postal_code");

//         const district =
//           getComp("administrative_area_level_2") ||
//           getComp("locality") ||
//           getComp("sublocality");

//         const cityName =
//           getComp("locality") ||
//           getComp("administrative_area_level_2") ||
//           city ||
//           null;

//         const stateName =
//           getComp("administrative_area_level_1") || state || null;

//         const formatted_address = place.formatted_address || null;
//         const lat = place.geometry?.location?.lat || null;
//         const lng = place.geometry?.location?.lng || null;

//         // 🔥 Avoid duplicate insert (important)
//         if (pincode) {
//           const [existing]: any = await db.query(
//             `SELECT id FROM pincode_details WHERE pincode = ? LIMIT 1`,
//             [pincode],
//           );

//           if (existing.length === 0) {
//             await db.query(
//               `INSERT INTO pincode_details
//               (pincode, postcode_localities, city, district, state, country, lat, lng, formatted_address)
//               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//               [
//                 pincode,
//                 area || null,
//                 cityName,
//                 district,
//                 stateName,
//                 countryLong,
//                 lat,
//                 lng,
//                 formatted_address,
//               ],
//             );
//           }
//         }

//         results.push({
//           pincode,
//           postcode_localities: area || null,
//           city: cityName,
//           district,
//           state: stateName,
//           country: countryLong,
//           lat,
//           lng,
//           formatted_address,
//         });
//       }),
//     );

//     return results;
//   } catch (err: any) {
//     console.error("getLatLangFromArea Error:", err.message);
//     return null;
//   }
// };
