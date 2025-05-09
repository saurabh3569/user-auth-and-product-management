const { Between, MoreThanOrEqual, LessThanOrEqual } = require("typeorm");
const { getProductRepository } = require("../src/repositories/repository");

// Create Product
const createProduct = async (req, res, next) => {
  try {
    const { name, price, inStock } = req.body;
    const productRepo = getProductRepository();

    console.log({
      name,
      price,
      inStock,
      user: { id: req.user.id },
    });

    const product = productRepo.create({
      name,
      price,
      inStock,
      user: { id: req.user.id },
    });

    await productRepo.save(product);
    return res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// Get all Products
const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "name",
      order = "asc",
      priceMin,
      priceMax,
    } = req.query;

    const productRepo = getProductRepository();

    // Use TypeORM comparison helpers
    const where = {};
    if (priceMin && priceMax) {
      where.price = Between(Number(priceMin), Number(priceMax));
    } else if (priceMin) {
      where.price = MoreThanOrEqual(Number(priceMin));
    } else if (priceMax) {
      where.price = LessThanOrEqual(Number(priceMax));
    }

    const [products, total] = await productRepo.findAndCount({
      where,
      order: {
        [sort]: order.toUpperCase() === "DESC" ? "DESC" : "ASC",
      },
      skip: (page - 1) * limit,
      take: Number(limit),
    });

    return res.status(200).json({
      data: products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// Get Product by ID
const getProductById = async (req, res, next) => {
  try {
    const productRepo = getProductRepository();
    let product = await productRepo.findOne({
      where: { id: req.params.id, user: { id: req.user.id } },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

// Update Product
const updateProduct = async (req, res, next) => {
  try {
    const { name, price, inStock } = req.body;
    const productRepo = getProductRepository();

    let product = await productRepo.findOne({
      where: { id: req.params.id, user: { id: req.user.id } },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name;
    product.price = price;
    product.inStock = inStock;

    await productRepo.save(product);
    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

// Delete Product
const deleteProduct = async (req, res, next) => {
  try {
    const productRepo = getProductRepository();
    let product = await productRepo.findOne({
      where: { id: req.params.id, user: { id: req.user.id } },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await productRepo.remove(product);
    return res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
