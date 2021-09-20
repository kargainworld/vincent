"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VinDecoder_1 = __importDefault(require("../services/VinDecoder"));
function validateVinRequest(req, res, next) {
    if (!req.params.vin) {
        return res.json({ success: false, error: 101 });
    }
    const { vin } = req.params;
    if (vin.length > 17) {
        return res.json({ success: false, error: 102 });
    }
    if (vin.length < 17) {
        return res.json({ success: false, error: 103 });
    }
    if (!VinDecoder_1.default.isVinValid(vin)) {
        return res.json({ success: false, error: 104 });
    }
    return next();
}
exports.default = validateVinRequest;
