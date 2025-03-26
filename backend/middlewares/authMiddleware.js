const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (req, res, next) => {
    console.log("📌 Headers:", req.headers);
    console.log("📌 Cookies:", req.cookies);

    // Lấy token từ cookie hoặc header Authorization
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("❌ Không tìm thấy token!");
        return res.status(401).json({ error: "Unauthorized: Please login first." });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log("✅ Token decoded:", decoded);

        req.user = decoded; // Lưu thông tin user vào req để sử dụng ở các middleware tiếp theo
        next();
    } catch (error) {
        console.log("❌ Token không hợp lệ:", error.message);
        return res.status(401).json({ error: "Invalid or expired token. Please login again." });
    }
};

// Middleware kiểm tra quyền Customer
module.exports.verifyCustomer = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: Please login first." });
    }

    if (req.user.role !== "customer") {
        console.log("🚫 Không phải customer! Vai trò:", req.user.role);
        return res.status(403).json({ error: "Access denied: Customers only." });
    }

    req.customerId = req.user.id;
    next();
};
