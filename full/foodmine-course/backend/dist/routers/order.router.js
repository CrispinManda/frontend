"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_status_1 = require("../constants/http_status");
const order_status_1 = require("../constants/order_status");
const order_model_1 = require("../models/order.model");
const auth_mid_1 = __importDefault(require("../middlewares/auth.mid"));
const router = (0, express_1.Router)();
router.use(auth_mid_1.default);
router.post('/create', (0, express_async_handler_1.default)(async (req, res) => {
    const requestOrder = req.body;
    if (requestOrder.items.length <= 0) {
        res.status(http_status_1.HTTP_BAD_REQUEST).send('Cart Is Empty!');
        return;
    }
    await order_model_1.OrderModel.deleteOne({
        user: req.user.id,
        status: order_status_1.OrderStatus.NEW
    });
    const newOrder = new order_model_1.OrderModel({ ...requestOrder, user: req.user.id });
    await newOrder.save();
    res.send(newOrder);
}));
router.get('/newOrderForCurrentUser', (0, express_async_handler_1.default)(async (req, res) => {
    const order = await getNewOrderForCurrentUser(req);
    if (order)
        res.send(order);
    else
        res.status(http_status_1.HTTP_BAD_REQUEST).send();
}));
router.post('/pay', (0, express_async_handler_1.default)(async (req, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
        res.status(http_status_1.HTTP_BAD_REQUEST).send('Order Not Found!');
        return;
    }
    order.paymentId = paymentId;
    order.status = order_status_1.OrderStatus.PAYED;
    await order.save();
    res.send(order._id);
}));
router.get('/track/:id', (0, express_async_handler_1.default)(async (req, res) => {
    const order = await order_model_1.OrderModel.findById(req.params.id);
    res.send(order);
}));
exports.default = router;
async function getNewOrderForCurrentUser(req) {
    return await order_model_1.OrderModel.findOne({ user: req.user.id, status: order_status_1.OrderStatus.NEW });
}
