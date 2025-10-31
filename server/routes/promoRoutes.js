// server/routes/promoRoutes.js
import express from 'express';
const router = express.Router();

// A simple in-memory list of valid promo codes
const VALID_PROMO_CODES = {
  SAVE10: { type: 'percentage', value: 10 }, // 10% off
  FLAT50: { type: 'flat', value: 50 },     // ₹50 off
};

// @route   POST /api/promo/validate
// @desc    Validate a promo code
// @access  Public
router.post('/validate', (req, res) => {
  const { promoCode } = req.body;

  if (VALID_PROMO_CODES[promoCode]) {
    res.json({
      isValid: true,
      code: promoCode,
      discount: VALID_PROMO_CODES[promoCode],
    });
  } else {
    res.status(404).json({ isValid: false, message: 'Invalid promo code' });
  }
});

export default router;