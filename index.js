require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ GET all data
app.get("/data", (_, res) => {
  db.query("SELECT * FROM codes", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ GET by code
app.get("/data/code/:code", (req, res) => {
  const code = req.params.code;
  db.query("SELECT * FROM codes WHERE code = ?", [code], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ GET by cartId
app.get("/data/cart/:cartId", (req, res) => {
  const cartId = req.params.cartId;
  db.query("SELECT * FROM codes WHERE cartId = ?", [cartId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ UPDATE by code
app.post("/update-by-code", (req, res) => {
  const { code, newCartId, used } = req.body;
  db.query(
    "UPDATE codes SET cartId = ?, used = ? WHERE code = ?",
    [newCartId, used, code],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.send("Update by code successful");
    }
  );
});

// ✅ UPDATE by cartId
app.post("/update-by-cart", (req, res) => {
  const { cartId, newCode, used } = req.body;
  db.query(
    "UPDATE codes SET code = ?, used = ? WHERE cartId = ?",
    [newCode, used, cartId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.send("Update by cartId successful");
    }
  );
});

// ✅ Health check
app.get("/", (_, res) => {
  res.send("API is live!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
