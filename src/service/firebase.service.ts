import admin from "firebase-admin";
import { executeQuery } from "../utils/helper";

admin.initializeApp({
//   credential: admin.credential.cert(require("./firebase-service.json")),
});

export const sendPushNotification = async (user_id: string, payload: any) => {
  const tokens: any[] = await executeQuery(
    `SELECT device_token FROM users WHERE user_id = ?`,
    [user_id],
  );

  if (!tokens.length) return;

  const deviceTokens = tokens.map((t) => t.device_token);

  await admin.messaging().sendEachForMulticast({
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
