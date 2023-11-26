"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = exports.OrderItemSchema = exports.LatLngSchema = void 0;
const mongoose_1 = require("mongoose");
const order_status_1 = require("../constants/order_status");
const food_model_1 = require("./food.model");
exports.LatLngSchema = new mongoose_1.Schema({
    lat: { type: String, required: true },
    lng: { type: String, required: true },
});
exports.OrderItemSchema = new mongoose_1.Schema({
    food: { type: food_model_1.FoodSchema, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});
const orderSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressLatLng: { type: exports.LatLngSchema, required: true },
    paymentId: { type: String },
    totalPrice: { type: Number, required: true },
    items: { type: [exports.OrderItemSchema], required: true },
    status: { type: String, default: order_status_1.OrderStatus.NEW },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});
exports.OrderModel = (0, mongoose_1.model)('order', orderSchema);
