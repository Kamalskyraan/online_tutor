"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const configOptions = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.PASSWORD,
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 20,
};
const transporter = nodemailer_1.default.createTransport(configOptions);
const sendMail = async (email, otp) => {
    try {
        const mailContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>OTP Verification</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;background:#f4f6f8;">
<tr>
<td align="center">

<table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,0.1);">


<tr>
<td style="background:#0093C7;padding:25px;text-align:center;color:white;font-size:22px;font-weight:bold;">
Online Tutor
</td>
</tr>

<!-- Image Banner -->
<tr>
<td align="center" style="padding:30px 20px 10px 20px;">
<img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
width="120"
style="display:block;margin:auto;" />
</td>
</tr>

<!-- Title -->
<tr>
<td style="text-align:center;padding:10px 30px;">
<h2 style="margin:0;color:#333;">Email Verification</h2>
<p style="color:#666;font-size:15px;margin-top:10px;">
Use the OTP below to verify your email address.
</p>
</td>
</tr>

<!-- OTP Box -->
<tr>
<td align="center" style="padding:20px;">
<div style="
background:#f1f9fc;
border:2px dashed #0093C7;
padding:18px 35px;
display:inline-block;
font-size:32px;
font-weight:bold;
letter-spacing:5px;
color:#0093C7;
border-radius:8px;
">
${otp}
</div>
</td>
</tr>

<!-- Message -->
<tr>
<td style="text-align:center;padding:10px 40px 30px 40px;">
Please do not share this code with anyone.
</p>
</td>
</tr>


</table>

</td>
</tr>
</table>

</body>
</html>
`;
        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Welcome to Online Tutor",
            html: mailContent,
        };
        await transporter.sendMail(mailOptions);
        return true;
    }
    catch (err) {
        console.log("Mail Error:", err);
        throw err;
    }
};
exports.sendMail = sendMail;
//# sourceMappingURL=mail.service.js.map