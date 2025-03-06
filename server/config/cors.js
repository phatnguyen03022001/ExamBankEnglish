module.exports = {
  origin: [
    process.env.CLIENT_URL, // URL của frontend trên môi trường production (lấy từ .env)
    "http://localhost:3000", // URL của frontend trên môi trường development
  ],
  // origin: '*',
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
