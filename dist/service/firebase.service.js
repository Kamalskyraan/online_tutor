"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAPNSNotification = exports.sendFCMNotification = exports.sendPushNotification = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const helper_1 = require("../utils/helper");
const node_apn_1 = __importDefault(require("@parse/node-apn"));
const apnprovider_1 = require("./apnprovider");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(require("./online-tutor-5655a-7da025c98c2d.json")),
});
const sendPushNotification = async ({ user_id, payload, }) => {
    try {
        const devices = await (0, helper_1.executeQuery)(`SELECT device_token, device_type 
       FROM user_devices
       WHERE user_id = ? AND device_token IS NOT NULL`, [user_id]);
        if (!devices.length)
            return;
        const androidTokens = [];
        const iosTokens = [];
        for (const d of devices) {
            if (d.device_type === "android") {
                androidTokens.push(d.device_token);
            }
            else if (d.device_type === "ios") {
                iosTokens.push(d.device_token);
            }
        }
        if (androidTokens.length) {
            await firebase_admin_1.default.messaging().sendEachForMulticast({
                tokens: androidTokens,
                notification: {
                    title: payload.title,
                    body: payload.message,
                },
            });
        }
        if (iosTokens.length) {
            await (0, exports.sendAPNSNotification)({
                tokens: iosTokens,
                title: payload.title,
                body: payload.message,
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
// export const sendAPNSNotification = async ({ tokens, title, body }: any) => {
//   try {
//     const notification = new apn.Notification();
//     notification.alert = {
//       title,
//       body,
//     };
//     notification.topic = process.env.IOS_BUNDLE_ID!;
//     const result = await apnProvider.send(notification, tokens);
//     console.log("APNS sent:", result.sent.length);
//     console.log("APNS failed:", result.failed.length);
//   } catch (err) {
//     console.error("APNS Error:", err);
//   }
// };
const sendAPNSNotification = async ({ tokens, title, body }) => {
    try {
        const notification = new node_apn_1.default.Notification();
        notification.alert = { title, body };
        notification.topic = process.env.IOS_BUNDLE_ID;
        const result = await apnprovider_1.apnProvider.send(notification, tokens);
        console.log(tokens);
        result.failed.forEach((f) => {
            console.error("❌ Token:", f.device);
            console.error("❌ Error:", f.response?.reason || f.error);
        });
        return result;
    }
    catch (err) {
        console.error("APNS Error:", err);
    }
};
exports.sendAPNSNotification = sendAPNSNotification;
//# sourceMappingURL=firebase.service.js.map