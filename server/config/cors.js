module.exports = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  // origin: '*',
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
