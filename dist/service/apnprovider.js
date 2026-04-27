"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apnProvider = void 0;
const node_apn_1 = __importDefault(require("@parse/node-apn"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.apnProvider = new node_apn_1.default.Provider({
    token: {
        key: path_1.default.join(__dirname, "AuthKey_G2HUL3X6FP_1.p8"),
        keyId: process.env.IOS_KEY_ID,
        teamId: process.env.IOS_TEAM_ID,
    },
    production: process.env.NODE_ENV === "production",
});
//# sourceMappingURL=apnprovider.js.map