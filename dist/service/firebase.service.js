"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAPNSNotification = exports.sendFCMNotification = exports.sendPushNotification = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const helper_1 = require("../utils/helper");
const node_apn_1 = __importDefault(require("@parse/node-apn"));
firebase_admin_1.default.initializeApp({
//   credential: admin.credential.cert(require("./firebase-service.json")),
});
const sendPushNotification = async (user_id, payload) => {
    try {
        const devices = await (0, helper_1.executeQuery)(`SELECT device_token, device_type 
       FROM users 
       WHERE user_id = ? AND device_token IS NOT NULL`, [user_id]);
        if (!devices.length)
            return;
        const androidTokens = [];
        const iosTokens = [];
        // ✅ Split tokens by device type
        for (const d of devices) {
            if (d.device_type === "android") {
                androidTokens.push(d.device_token);
            }
            else if (d.device_type === "ios") {
                iosTokens.push(d.device_token);
            }
        }
        // ✅ Send FCM (Android)
        if (androidTokens.length) {
            await firebase_admin_1.default.messaging().sendEachForMulticast({
                tokens: androidTokens,
                notification: {
                    title: payload.title,
                    body: payload.message,
                },
                data: {
                    type: payload.type,
                    extra_data: JSON.stringify(payload.extra_data || {}),
                },
            });
        }
        // ✅ Send APNS (iOS)
        for (const token of iosTokens) {
            await (0, exports.sendAPNSNotification)({
                token,
                title: payload.title,
                body: payload.message,
                data: payload.extra_data,
            });
        }
    }
    catch (err) {
        console.error("Push Notification Error:", err);
    }
};
exports.sendPushNotification = sendPushNotification;
const sendFCMNotification = async ({ token, title, body, data, }) => {
    await firebase_admin_1.default.messaging().send({
        token,
        notification: {
            title,
            body,
        },
        data: {
            ...data,
        },
    });
};
exports.sendFCMNotification = sendFCMNotification;
const sendAPNSNotification = async ({ token, title, body, data, }) => {
    const notification = new node_apn_1.default.Notification();
    notification.alert = {
        title,
        body,
    };
    notification.payload = data;
    // notification.topic = process.env.BUNDLE_ID;
    // await apnProvider.send(notification, token);
};
exports.sendAPNSNotification = sendAPNSNotification;
//# sourceMappingURL=firebase.service.js.map