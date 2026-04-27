import admin from "firebase-admin";
import { executeQuery } from "../utils/helper";
import apn from "@parse/node-apn";
import { apnProvider } from "./apnprovider";
import dotenv from "dotenv";
dotenv.config();
admin.initializeApp({
  //   credential: admin.credential.cert(require("./firebase-service.json")),
});

export const sendPushNotification = async ({
  user_id,
  payload,
}: {
  user_id: string;
  payload: { title: string; message: string };
}) => {
  try {
    console.log(user_id, payload);
    const devices: any[] = await executeQuery(
      `SELECT device_token, device_type 
       FROM user_devices
       WHERE user_id = ? AND device_token IS NOT NULL`,
      [user_id],
    );

    if (!devices.length) return;

    const androidTokens: string[] = [];
    const iosTokens: string[] = [];

    for (const d of devices) {
      if (d.device_type === "android") {
        androidTokens.push(d.device_token);
      } else if (d.device_type === "ios") {
        iosTokens.push(d.device_token);
      }
    }

    if (androidTokens.length) {
      await admin.messaging().sendEachForMulticast({
        tokens: androidTokens,
        notification: {
          title: payload.title,
          body: payload.message,
        },
      });
    }

    // ✅ iOS (FIXED)
    if (iosTokens.length) {
      await sendAPNSNotification({
        tokens: iosTokens,
        title: payload.title,
        body: payload.message,
      });
    }
  } catch (err) {
    console.error("Push Notification Error:", err);
  }
};

export const sendFCMNotification = async ({
  token,
  title,
  body,
  data,
}: any) => {
  await admin.messaging().send({
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

export const sendAPNSNotification = async ({ tokens, title, body }: any) => {
  try {
    const notification = new apn.Notification();

    notification.alert = { title, body };
    notification.topic = process.env.PACKAGE_NAME!;

    const result = await apnProvider.send(notification, tokens);

    console.log("APNS sent:", result.sent.length);
    console.log("APNS failed:", result.failed.length);

    result.failed.forEach((f: any) => {
      console.error("❌ Token:", f.device);
      console.error("❌ Error:", f.response?.reason || f.error);
    });

    return result;
  } catch (err) {
    console.error("APNS Error:", err);
  }
};
