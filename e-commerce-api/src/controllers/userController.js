const bcrypt = require('bcrypt');
const logEvents = require('../helpers/logEvents');
const User = require('../models/User');
const userController = {
    updateUser: async (req, res) => {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashed
        }
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            const { password, ...others } = updateUser._doc
            return res.status(200).json({ ...others, message: "Update user successfully!!" });
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("User has been deleted successfully!");
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            const { password, ...others } = user._doc;
            return res.status(200).json({ ...others });
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    getAllUsers: async (req, res) => {
        const query = req.query.new;
        try {
            const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
            return res.status(200).json(users);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    },
    getUserStats: async (req, res) => {
        const date = new Date();
        const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
        try {
            const data = await User.aggregate([
                { $match: { createdAt: { $gte: lastYear } } }, //gte >=
                { $project: { month: { $month: "$createdAt" } } },
                { $group: { _id: "$month", total: { $sum: 1 } } },  //$group nhom id theo thang duoc tao ra va tinh tong cac hang
            ])
            return res.status(200).json(data);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error.message);
        }
    }
}

module.exports = userController;