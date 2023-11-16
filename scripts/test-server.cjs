const express = require("express");
const path = require("path");

const app = express();
const PORT = 8080;
const PATH = "../dist";

// Define middleware to set headers for the root route
app.use("/", (req, res, next) => {
  if (req.originalUrl === "/") {
    // Set specific headers for the root route
    res.set({
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    });
  }
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, PATH)));

// Serve index.html for all routes (since it's file-based routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, PATH, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
