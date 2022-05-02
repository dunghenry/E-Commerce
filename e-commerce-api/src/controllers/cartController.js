const Cart = require('../models/Cart');
const logEvents = require('../helpers/logEvents');
const cartController = {
    createCart: async (req, res) => {
        try {
            const newCart = new Cart(req.body);
            const savedCart = await newCart.save();
            return res.status(200).json(savedCart);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message)
        }
    },
    updateCart: async (req, res) => {
        try {
            const updateCart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json(updateCart)
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message)
        }
    },
    deleteCart: async (req, res) => {
        try {
            await Cart.findByIdAndDelete(req.params.id);
            return res.status(200).json("Cart has been deleted successfully");
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message)
        }
    },
    getCart: async (req, res) => {
        try {
            const cart = await Cart.findOne({ userId: req.params.userId });
            return res.status(200).json(cart);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message)
        }
    },
    getAllCarts: async (req, res) => {
        try {
            const carts = await Cart.find({});
            return res.status(200).jaon(carts);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message)
        }
    }
}

module.exports = cartController;