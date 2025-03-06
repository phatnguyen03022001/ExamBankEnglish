module.exports = {
  origin: "http://localhost:3000" || process.env.CLIENT_URL,
  // origin: '*',
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
