const User = require('../models/User');
const logEvents = require('../helpers/logEvents');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authController = {
    register: async (req, res) => {
        if(!req.body.username || !req.body.password || !req.body.email) return res.status(400).json("Missing username or password or email");
        try {
            const user = await User.findOne({ username: req.body.username });
            if (user) return res.status(400).json("User already taken!");
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed
            })
            await newUser.save();
            return res.status(201).json(newUser);
        } catch (error) {
            await logEvents(error.message, module.filename)
            return res.status(500).json(error.message);
        }
    },
    login: async (req, res) => {
         if(!req.body.username || !req.body.password) return res.status(400).json("Missing username or password");
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) return res.status(401).json("Username not found or wrong username!");
            const passwordValid = await bcrypt.compare(req.body.password, user.password);
            if (!passwordValid) return res.status(401).json("Password is incorrect!!")
            const { password, ...others } = user._doc;
            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin
            }, process.env.ACCESS_TOKEN_SECRET , {
                expiresIn: '3d'
            })
            if (user && passwordValid)
                return res.status(200).json({...others, accessToken});
        } catch (error) {
            await logEvents(error.message, module.filename)
            return res.status(500).json(error.message);
        }
    }
}

module.exports = authController;