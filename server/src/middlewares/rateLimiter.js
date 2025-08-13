const rateLimit = require('express-rate-limit');

// Limiter pentru login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 5,
  message: "Prea multe încercări de login, încearcă mai târziu!",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  // poți exporta și alte limitere, ex: generalLimiter, registerLimiter etc
};
