import apn from "@parse/node-apn";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const apnProvider = new apn.Provider({
  token: {
    key: path.join(__dirname, "AuthKey_G2HUL3X6FP_1.p8"),
    keyId: process.env.IOS_KEY_ID!,
    teamId: process.env.IOS_TEAM_ID!,
  },
  // production: process.env.NODE_ENV === "production",
  production: true,
});
