"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = require("mongoose");
const dbConnect = () => {
    (0, mongoose_1.connect)(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("connect successfully"), (error) => console.log(error));
};
exports.dbConnect = dbConnect;
