require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const app = express();
app.use(express.json());

const SECRET_KEY = "your_jwt_secret_key"; // Replace with a strong secret
const ENCRYPTION_KEY = "your_encryption_key"; // Replace with a strong key

// Generate and encrypt JWT
app.post("/generate", (req, res) => {
    const payload = { userId: 123, role: "admin" }; // Example payload

    // Step 1: Create a JWT token
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    // Step 2: Encrypt the token using AES
    const encryptedToken = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();

    res.json({ encryptedToken });
});

// Decrypt and verify JWT
app.post("/decrypt", (req, res) => {
    const { encryptedToken } = req.body;

    try {
        // Step 1: Decrypt the encrypted token
        const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

        // Step 2: Verify the JWT token
        const decoded = jwt.verify(decryptedToken, SECRET_KEY);

        res.json({ success: true, decoded });
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid token" });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
