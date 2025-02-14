const express = require("express");
const crypto = require("crypto");
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const SHOPIER_API_USER = process.env.SHOPIER_API_USER;
const SHOPIER_API_KEY = process.env.SHOPIER_API_KEY;
const SHOPIER_BASE_URL = process.env.SHOPIER_BASE_URL || "https://www.shopier.com";

// CORS Konfigürasyonu
const allowedOrigins = ["http://localhost:3000", "https://www.techsepet.shop"];
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// CORS Preflight Requests İçin OPTIONS Middleware
app.options("*", cors({
    origin:allowedOrigins,
    methods:["GET","POST","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}));

app.post("/api/payment", (req, res) => {
    try {
        const { orderId, amount, currency, buyerEmail, buyerName, successUrl, failUrl } = req.body;

        if (!orderId || !amount || !buyerEmail || !buyerName || !successUrl || !failUrl) {
            return res.status(400).json({ message: "Eksik ödeme bilgileri!" });
        }

        const paymentUrl = `https://www.shopier.com/pgw/?orderId=${orderId}&amount=${amount}`;

        // ✅ API Yanıtı Her Zaman JSON Dönmeli
        res.status(200).json({ success: true, paymentUrl: paymentUrl });
    } catch (error) {
        console.error("Ödeme oluşturma hatası:", error);
        res.status(500).json({ message: "Ödeme oluşturulamadı!", error: error.message });
    }
});


// Sunucuyu başlat
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
