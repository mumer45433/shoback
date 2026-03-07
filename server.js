const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // ✅ Naya
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB Connection
const MONGO_URI = "Aapka_Connection_String_Yahan_Daalein"; // 👈 Yahan apna URL daalein
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log("DB Connection Error:", err));

// Order Schema (Database mein data kaisa dikhega)
const orderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  customerDetails: Object,
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

app.use(cors({ origin: "https://shoies.netlify.app" }));
app.use(bodyParser.json());

// GET /products (Products array wahi rahegi jo pehle thi)
let products = [ /* Aapka purana products data */ ];
app.get("/products", (req, res) => res.json(products));

// POST /orders - Ab data Database mein jayega
app.post("/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save(); // ✅ Cloud par save ho gaya!
    res.json({ message: "Order saved to Cloud", orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ message: "Error saving order" });
  }
});

// GET /orders - Database se orders uthayein
app.get("/orders", async (req, res) => {
  const orders = await Order.find().sort({ date: -1 });
  res.json(orders);
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Running on ${PORT}`));
}