import dotenv from "dotenv";
dotenv.config();

// const fast2sms_key = process.env.fast2sms_key;
// const SENDER_ID = process.env.FAST2SMS_SENDER_ID;
// const TEMPLATE_ID = process.env.FAST2SMS_TEMPLATE_ID;
// const time_min = process.env.FAST2SMS_TIME_MIN;
// const flash = process.env.FAST2SMS_FLASH;

const fast2sms_key =
  "c8NjV0nhpT7DsA6LuFReCKgPadIxSJYkE1zqbQGMyfXoi35WUv8NxIbpt5fvTj23Lhc9dG0uiDmR1lSV";
const SENDER_ID = "SKRAAN";
const TEMPLATE_ID = 195270;
const time_min = 3;
const flash = 0;

export const sendSmsOTP = async (phone: string, otp: string) => {
  const payload = {
    route: "dlt",
    sender_id: SENDER_ID,
    message: TEMPLATE_ID,
    variables_values: `${otp}|${time_min}`,
    flash: flash,
    numbers: phone,
  };

  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: fast2sms_key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send SMS OTP");
  }
};
