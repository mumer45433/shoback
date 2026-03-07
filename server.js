const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js"); // ✅ Supabase Library
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Supabase Setup
const SUPABASE_URL = "https://ioginkteiejxyyiluumd.supabase.co";
const SUPABASE_KEY = "sb_publishable_4zv2U001ayFhCo52RT9pTg_nkKJ4E74";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors({ origin: "https://shoies.netlify.app" }));
app.use(bodyParser.json());

// Products Data (Wahi rahega)
let products = [ /* Aapka purana products array */ ];

// GET /products
app.get("/products", (req, res) => res.json(products));

// POST /orders - Ab data Supabase mein jayega
app.post("/orders", async (req, res) => {
  const { items, total, customerDetails } = req.body;

  // Supabase mein "orders" table mein data insert karein
  const { data, error } = await supabase
    .from('orders')
    .insert([
      { 
        items: items, 
        total: total, 
        customer_details: customerDetails,
        created_at: new Date() 
      }
    ]);

  if (error) {
    console.error("Supabase Error:", error);
    return res.status(500).json({ message: "Error saving order" });
  }

  res.json({ message: "Order saved to Supabase", data });
});

// GET /orders - Supabase se orders uthayein
app.get("/orders", async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json(error);
  res.json(data);
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}