"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const VinDataSchema = new Schema({
    vin: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    ModelYear: String,
    PlantCountry: String,
    Make: String,
    Model: String,
    Trim: String,
    VehicleType: String,
    Doors: String,
    DisplacementCC: String,
    FuelTypePrimary: String,
});
exports.default = model('VinData', VinDataSchema);
