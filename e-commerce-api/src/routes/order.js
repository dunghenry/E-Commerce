const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization} = require('../middleware/verifyToken');
router.post("/orders", verifyToken, orderController.createOrder);
router.get("/orders", verifyTokenAndAdmin, orderController.createOrder);
router.get("/orders/income", verifyTokenAndAdmin, orderController.getIncome);
router.put("/orders/:id", verifyTokenAndAdmin, orderController.updateOrder);
router.delete("/orders/:id", verifyTokenAndAdmin, orderController.deleteOrder);
router.get("/orders/find/:userId", verifyTokenAndAuthorization, orderController.getOrder);

module.exports = router;