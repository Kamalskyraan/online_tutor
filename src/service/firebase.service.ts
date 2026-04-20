import admin from "firebase-admin";
import { executeQuery } from "../utils/helper";
import apn from "@parse/node-apn";
admin.initializeApp({
  //   credential: admin.credential.cert(require("./firebase-service.json")),
});

export const sendPushNotification = async (user_id: string, payload: any) => {
  try {
    const devices: any[] = await executeQuery(
      `SELECT device_token, device_type 
       FROM users 
       WHERE user_id = ? AND device_token IS NOT NULL`,
      [user_id],
    );

    if (!devices.length) return;

    const androidTokens: string[] = [];
    const iosTokens: string[] = [];

    // ✅ Split tokens by device type
    for (const d of devices) {
      if (d.device_type === "android") {
        androidTokens.push(d.device_token);
      } else if (d.device_type === "ios") {
        iosTokens.push(d.device_token);
      }
    }

    // ✅ Send FCM (Android)
    if (androidTokens.length) {
      await admin.messaging().sendEachForMulticast({
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
      await sendAPNSNotification({
        token,
        title: payload.title,
        body: payload.message,
        data: payload.extra_data,
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

export const sendAPNSNotification = async ({
  token,
  title,
  body,
  data,
}: any) => {
  const notification = new apn.Notification();

  notification.alert = {
    title,
    body,
  };

  notification.payload = data;
  // notification.topic = process.env.BUNDLE_ID;

  // await apnProvider.send(notification, token);
};
