"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../data");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_model_1 = require("../models/user.model");
const http_status_1 = require("../constants/http_status");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
router.get("/seed", (0, express_async_handler_1.default)(async (req, res) => {
    const usersCount = await user_model_1.UserModel.countDocuments();
    if (usersCount > 0) {
        res.send("Seed is already done!");
        return;
    }
    await user_model_1.UserModel.create(data_1.sample_users);
    res.send("Seed Is Done!");
}));
router.post("/login", (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await user_model_1.UserModel.findOne({ email });
    if (user && (await bcryptjs_1.default.compare(password, user.password))) {
        res.send(generateTokenReponse(user));
    }
    else {
        res.status(http_status_1.HTTP_BAD_REQUEST).send("Username or password is invalid!");
    }
}));
router.post('/register', (0, express_async_handler_1.default)(async (req, res) => {
    const { name, email, password, address } = req.body;
    const user = await user_model_1.UserModel.findOne({ email });
    if (user) {
        res.status(http_status_1.HTTP_BAD_REQUEST)
            .send('User is already exist, please login!');
        return;
    }
    const encryptedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = {
        id: '',
        name,
        email: email.toLowerCase(),
        password: encryptedPassword,
        address,
        isAdmin: false
    };
    const dbUser = await user_model_1.UserModel.create(newUser);
    res.send(generateTokenReponse(dbUser));
}));
const generateTokenReponse = (user) => {
    const token = jsonwebtoken_1.default.sign({
        id: user.id, email: user.email, isAdmin: user.isAdmin
    }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        token: token
    };
};
exports.default = router;
