const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controllers/productController");
const authenticateJWT = require("../middlewares/authMiddleware");

router.post("/", authenticateJWT, createProduct);
router.get("/", authenticateJWT, getAllProducts);
router.get("/:id", authenticateJWT, getProductById);
router.put("/:id", authenticateJWT, updateProduct);
router.delete("/:id", authenticateJWT, deleteProduct);

module.exports = router;
