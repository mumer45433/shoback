const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
// ✅ CHANGE 1: Port dynamically assign hogi
const PORT = process.env.PORT || 5001; 

// ✅ CHANGE 2: CORS mein apni Netlify site ka link dena behtar hai
app.use(cors({
  origin: "https://shoies.netlify.app" 
}));
// const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Path to orders.json
const ordersFile = path.join(__dirname, "orders.json");

// Load orders from JSON file or create empty array
let orders = [];
if (fs.existsSync(ordersFile)) {
  try {
    const data = fs.readFileSync(ordersFile, "utf-8");
    orders = JSON.parse(data);
  } catch (err) {
    console.error("Failed to read orders.json:", err);
    orders = [];
  }
}

// Save orders to JSON file
const saveOrders = () => {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf-8");
};

// Shoes (Sneakers / Casual) products with working images
let products = [
  {
    id: 1,
    name: "White Nike Style Sneakers",
    price: 8500,
    brand: "Nike",
      discount: 20, // ← this is required

    color: "White",
    size: ["40", "41", "42"],
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    description: "Comfortable white sneakers for daily wear",
  },
  {
    id: 2,
    name: "Black Running Sneakers",
    price: 7800,
    brand: "Adidas",
    color: "Black",
      discount: 20, // ← this is required

    size: ["41", "42", "43"],
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400",
    description: "Lightweight black running sneakers",
  },
  {
    id: 3,
    name: "Classic Casual Shoes",
    price: 7200,
    brand: "Puma",
    color: "Brown",
      discount: 20, // ← this is required

    size: ["39", "40", "41"],
    category: "Casual",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
    description: "Stylish casual shoes for everyday use",
  },
  {
    id: 4,
    name: "Street Style Sneakers",
    price: 9100,
    brand: "Nike",
    color: "Red",
    size: ["41", "42"],
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1519744346363-dc3b2d4c5e6f?w=400",
    description: "Modern street style sneakers",
  },
  {
    id: 5,
    name: "Canvas Casual Shoes",
    price: 6500,
    brand: "Converse",
    color: "White",
    size: ["39", "40", "41"],
    category: "Casual",
    image: "https://images.unsplash.com/photo-1520256862855-398228c41684?w=400",
    description: "Comfortable canvas casual shoes",
  },
  {
    id: 6,
    name: "Sport Running Shoes",
    price: 9800,
    brand: "Adidas",
    color: "Black",
    size: ["42", "43"],
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400",
    description: "High performance sport running shoes",
  },
  {
    id: 7,
    name: "Minimal White Sneakers",
    price: 8900,
    brand: "Nike",
    color: "White",
    size: ["40", "41", "42"],
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    description: "Minimal design white sneakers",
  },
  {
    id: 8,
    name: "Casual Street Shoes",
    price: 7000,
    brand: "Puma",
    color: "Black",
    size: ["40", "41", "42"],
    category: "Casual",
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400",
    description: "Comfortable street casual shoes",
  },
  {
    id: 9,
    name: "Minimal White Sneakers",
    price: 8900,
    brand: "Nike",
    color: "White",
    size: ["40", "41", "42"],
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    description: "Minimal design white sneakers",
  },
  
  {
    id: 10,
    name: "Minimal White Sneakers",
    price: 8900,
    brand: "Nike",
    color: "White",
    size: ["40", "41", "42"],
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    description: "Minimal design white sneakers",
  },
];

// POST /orders - save order
app.post("/orders", (req, res) => {
  const order = req.body;
  if (!order || !order.items || order.items.length === 0) {
    return res.status(400).json({ message: "Invalid order" });
  }

  order.id = orders.length + 1;
  order.date = new Date();
  orders.push(order);

  saveOrders(); // ✅ save to JSON file

  console.log("New Order:", order);
  res.json({ message: "Order saved", orderId: order.id });
});

// GET /orders - list all orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// GET /products - return product list
app.get("/products", (req, res) => {
  res.json(products);
});
// ✅ CHANGE 3: Localhost ka word hata dein taake confuse na ho
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

// // Start server AFTER all routes are defined
// app.listen(PORT, () => {
//   console.log(`Backend running at http://localhost:${PORT}`);
// });