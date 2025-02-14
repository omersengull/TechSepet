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
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS Policy Error: Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// CORS Preflight Requests İçin OPTIONS Middleware
app.options("*", cors());

app.post("/api/payment", (req, res) => {
    try {
        const { orderId, amount, currency, buyerEmail, buyerName, successUrl, failUrl } = req.body;

        if (!orderId || !amount || !buyerEmail || !buyerName || !successUrl || !failUrl) {
            return res.status(400).json({ message: "Eksik ödeme bilgileri!" });
        }

        // SHA256 ile güvenli imza oluşturma
        const hashStr = `${SHOPIER_API_USER}|${orderId}|${amount}|${currency}`;
        const signature = crypto.createHmac("sha256", SHOPIER_API_KEY).update(hashStr).digest("hex");

        // Shopier Ödeme URL'si oluşturma
        const paymentUrl = `${SHOPIER_BASE_URL}/pgw/?apiUser=${SHOPIER_API_USER}&signature=${signature}`;

        // Ödeme verilerini JSON formatında POST isteği ile göndermek
        const paymentData = {
            orderId,
            amount,
            currency,
            buyerEmail,
            buyerName,
            successUrl,
            failUrl
        };

        res.status(200).json({ paymentUrl, paymentData });
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
