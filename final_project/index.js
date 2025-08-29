const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const regd_users = require("./router/auth_users.js");

const app = express();
app.use(express.json());

const SECRET_KEY = "secrect123"; // must match exactly in auth_users.js

// Middleware to check JWT
app.use("/customer/auth/*", (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // { username: "alice" }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
});

app.use("/customer", regd_users);

app.listen(5000, () => console.log("Server running on port 5000"));

