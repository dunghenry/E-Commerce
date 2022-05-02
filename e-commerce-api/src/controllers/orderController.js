const Order = require('../models/Order');
const logEvents = require('../helpers/logEvents');
const orderController = {
    createOrder: async (req, res) => {
        try {
            const newOrder = new Order(req.body);
            const savedOrder = await newOrder.save();
            return res.status(200).json(savedOrder);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    updateOrder: async (req, res) => {
        try {
            const updateOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json(updateOrder);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    deleteOrder: async (req, res) => {
        try {
            await Order.findByIdAndDelete(req.params.id);
            return res.status(200).json("Order has been deleted successfully!");
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    getOrder: async (req, res) => {
        try {
            const orders = await Order.find({ userId: req.params.userId });
            return res.status(200).json(orders);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find({});
            return res.status(200).json(orders);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    getIncome: async (req, res) => {
        const date = new Date();
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
        const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))
        try {
            const income = await Order.aggregate([
                { $match: { createdAt: { $gte: previousMonth } } },
                {
                    $project: {
                        month: { $month: "$createdAt" },
                        sales: "$amount"
                    }
                },
                {
                    $group: {
                        _id: "$month",
                        total: {$sum: "$sales"}
                    }
                }
            ])
            return res.status(200).json(income);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    }
}

module.exports = orderController