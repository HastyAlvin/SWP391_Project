const otpStore = {};

const storeOTP = (email, otp) => {
  otpStore[email] = {
    otp,
    expiry: Date.now() + 5 * 60 * 1000,
  };
};

const verifyOTP = (email, otp) => {
  const otpData = otpStore[email];
  console.log("Đang xác minh OTP:", otp, "Đã lưu:", otpData);

  if (!otpData) {
    return { valid: false, message: "OTP not found" };
  }

  if (otpData.otp.toString() !== otp.toString()) {
    return { valid: false, message: "Invalid OTP" };
  }

  if (Date.now() > otpData.expiry) {
    return { valid: false, message: "OTP expired" };
  }

  return { valid: true, message: "OTP is valid" };
};

const clearOTP = (email) => {
  delete otpStore[email];
};

module.exports = { storeOTP, verifyOTP, clearOTP };
// const { storeOTP, verifyOTP, clearOTP } = require("../utiles/otpStore.js");
