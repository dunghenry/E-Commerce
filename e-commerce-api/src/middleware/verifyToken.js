const jwt = require('jsonwebtoken');
const logEvents = require('../helpers/logEvents');
const verifyToken = async (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        const accessToken = token.split(" ")[1];
        if (accessToken) {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        await logEvents(err.message, module.filename);
                        return res.status(401).json('accessToken is expired!!!');
                    }
                    await logEvents(err.message, module.filename);
                    return res.status(403).json('Token is not valid!!!');
                }
                req.user = user;
                next();
            })
        }
        else {
            return res.status(404).json("AccessToken not found");
        }
    }
    else {
        await logEvents("You are not authenticated!", module.filename);
        return res.status(401).json("You are not authenticated!");
    }
}
const verifyTokenAndAuthorization = async (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json("You're not allowed to do that!");
        }
    });
}
const verifyTokenAndAdmin = async (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json("You're not allowed to do that!");
        }
    });
}
module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};