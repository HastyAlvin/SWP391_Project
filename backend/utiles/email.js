const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { storeOTP } = require("./otpStore.js");

dotenv.config();

function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "SportyZone FORGOT PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OTP Email Template</title>
</head>
<body>
<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2;">
  <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
    <div style="border-bottom: 1px solid #eee;">
      <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">Sporty Zone system</a>
    </div>
    <p style="font-size: 1.1em;">Hi,</p>
    <p>Thank you for choosing Sporty Zone system. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes:</p>
    <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${OTP}</h2>
    <p style="font-size: 0.9em;">Regards,<br />Sporty Zone system</p>
  </div>
</div>
</body>
</html>`,
    };
    storeOTP(recipient_email, OTP);

    transporter.sendMail(mail_configs, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        return reject({ message: `An error has occurred` });
      }
      console.log("Email sent: ", info.response);
      return resolve({ message: "Email sent successfully" });
    });
  });
}

async function sendEmailToUser(email, password) {
  if (process.env.EMAIL_ENABLED === "false") {
    return;
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: "Thông tin tài khoản của bạn",
    html: `<p>Chào mừng bạn đến với hệ thống SportyZone. Đây là thông tin tài khoản của bạn:</p>
           <p>Email: ${email}</p>
           <p>Mật khẩu: ${password}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Unable to send email.");
  }
}

module.exports = { sendEmail, sendEmailToUser };
