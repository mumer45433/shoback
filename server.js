// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// // ✅ CHANGE 1: Port dynamically assign hogi
// const PORT = process.env.PORT || 5001; 

// // ✅ CHANGE 2: CORS mein apni Netlify site ka link dena behtar hai
// app.use(cors({
//   origin: "https://shoies.netlify.app" 
// }));
// // const PORT = 5001;

// app.use(cors());
// app.use(bodyParser.json());

// // Path to orders.json
// const ordersFile = path.join(__dirname, "orders.json");

// // Load orders from JSON file or create empty array
// let orders = [];
// if (fs.existsSync(ordersFile)) {
//   try {
//     const data = fs.readFileSync(ordersFile, "utf-8");
//     orders = JSON.parse(data);
//   } catch (err) {
//     console.error("Failed to read orders.json:", err);
//     orders = [];
//   }
// }

// // Save orders to JSON file
// const saveOrders = () => {
//   fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf-8");
// };

 

// // POST /orders - save order
// app.post("/orders", (req, res) => {
//   const order = req.body;
//   if (!order || !order.items || order.items.length === 0) {
//     return res.status(400).json({ message: "Invalid order" });
//   }

//   order.id = orders.length + 1;
//   order.date = new Date();
//   orders.push(order);

//   saveOrders(); // ✅ save to JSON file

//   console.log("New Order:", order);
//   res.json({ message: "Order saved", orderId: order.id });
// });

// // GET /orders - list all orders
// app.get("/orders", (req, res) => {
//   res.json(orders);
// });

// // GET /products - return product list
// app.get("/products", (req, res) => {
//   res.json(products);
// });
// // ✅ CHANGE 3: Localhost ka word hata dein taake confuse na ho
// app.listen(PORT, () => {
//   console.log(`Backend running on port ${PORT}`);
// });

// module.exports = app;

// // Ye sirf local testing ke liye rehne dein
// if (process.env.NODE_ENV !== 'production') {
//   app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
//   });
// }

// // // Start server AFTER all routes are defined
// // app.listen(PORT, () => {
// //   console.log(`Backend running at http://localhost:${PORT}`);
// // });


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001; 

// ✅ CORS: Sirf aik baar define karein (Duplicate hata diya)
app.use(cors({
  origin: "https://shoies.netlify.app" 
}));

app.use(bodyParser.json());

const ordersFile = path.join(__dirname, "orders.json");

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

const saveOrders = () => {
  // ✅ Vercel par file save nahi hoti, isliye try-catch lagana zaroori hai
  try {
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.log("File saving not supported on this platform (Expected on Vercel)");
  }
};

// ... (Aapki products array yahan aye gi) ...

app.post("/orders", (req, res) => {
  const order = req.body;
  if (!order || !order.items || order.items.length === 0) {
    return res.status(400).json({ message: "Invalid order" });
  }

  order.id = orders.length + 1;
  order.date = new Date();
  orders.push(order);
  saveOrders();

  res.json({ message: "Order saved", orderId: order.id });
});

app.get("/orders", (req, res) => res.json(orders));
app.get("/products", (req, res) => res.json(products));

// ✅ Vercel exports ke liye zaroori hai
module.exports = app;

// ✅ Sirf Local Environment ke liye listen karein
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
}