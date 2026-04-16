"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const helper_1 = require("../utils/helper");
firebase_admin_1.default.initializeApp({
//   credential: admin.credential.cert(require("./firebase-service.json")),
});
const sendPushNotification = async (user_id, payload) => {
    const tokens = await (0, helper_1.executeQuery)(`SELECT device_token FROM users WHERE user_id = ?`, [user_id]);
    if (!tokens.length)
        return;
    const deviceTokens = tokens.map((t) => t.device_token);
    await firebase_admin_1.default.messaging().sendEachForMulticast({
        tokens: deviceTokens,
        notification: {
            title: payload.title,
            body: payload.message,
        },
        data: {
            type: payload.type,
            extra_data: JSON.stringify(payload.extra_data || {}),
        },
    });
};
exports.sendPushNotification = sendPushNotification;
//# sourceMappingURL=firebase.service.js.map