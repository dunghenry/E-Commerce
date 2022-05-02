const Product = require('../models/Product');
const logEvents = require('../helpers/logEvents');
const productController = {
    createProduct: async (req, res) => {
        if (!req.body.title)
            return res.status(400).json("Missing title or description or image url!");
        try {
            const product = await Product.findOne({ title: req.body.title });
            if(product) return res.status(400).json("Product already exists!");
            const newProduct = new Product(req.body);
            const savedProduct = await newProduct.save();
            return res.status(200).json(savedProduct);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    updateProduct: async (req, res) => {
        if (!req.body.title)
            return res.status(400).json("Missing title or description or image url!");
        try {
            const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
            return res.status(200).json(updateProduct);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    deleteProduct: async (req, res) => {
         try {
            await Product.findByIdAndDelete(req.params.id);
            return res.status(200).json("Product has been deleted successfully");
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    getProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json("Product not found!!!");
            return res.status(200).json(product);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    getAllProducts: async (req, res) => {
        const qNew = req.query.new;
        const qCategory = req.query.category;
        try {
            let products;
            if (qNew) {
                products = await Product.find().sort({ createdAt: -1 }).limit(1); //Lay products tao ra moi nhat
            }
            else if (qCategory) {
                products = await Product.find({
                    categories: {
                    $in: [qCategory]
                }})
            }
            else {
                products = await Product.find();
            }
            if(!products) return res.status(404).json("Products not found!!!");
            return res.status(200).json(products);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    }
}

module.exports = productController;