const user = require('./user');
const auth = require('./auth');
const product = require('./product');
const cart = require('./cart');
const order = require('./order');
const stripe = require('./stripe');
const routes = [
    auth,
    user,
    product,
    cart,
    order,
    stripe
];
module.exports = routes;