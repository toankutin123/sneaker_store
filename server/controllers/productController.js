import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    }
    
    // Convert numeric fields
    if (productData.price) productData.price = Number(productData.price);
    if (productData.salePrice) productData.salePrice = Number(productData.salePrice);
    if (productData.stock) productData.stock = Number(productData.stock);
    if (productData.rating) productData.rating = Number(productData.rating);
    if (productData.reviews) productData.reviews = Number(productData.reviews);
    if (productData.sold) productData.sold = Number(productData.sold);
    
    // Parse sizes if it's a string
    if (typeof productData.sizes === 'string') {
      productData.sizes = JSON.parse(productData.sizes);
    }
    
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      const productData = { ...req.body };
      
      // Handle image upload
      if (req.file) {
        productData.image = `/uploads/${req.file.filename}`;
      }
      
      // Convert numeric fields
      if (productData.price) productData.price = Number(productData.price);
      if (productData.salePrice) productData.salePrice = Number(productData.salePrice);
      if (productData.stock) productData.stock = Number(productData.stock);
      if (productData.rating) productData.rating = Number(productData.rating);
      if (productData.reviews) productData.reviews = Number(productData.reviews);
      if (productData.sold) productData.sold = Number(productData.sold);
      
      // Parse sizes if it's a string
      if (typeof productData.sizes === 'string') {
        productData.sizes = JSON.parse(productData.sizes);
      }
      
      await product.update(productData);
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
