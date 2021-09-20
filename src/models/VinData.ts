import mongoose from 'mongoose';

const { Schema, model } = mongoose;

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

export default model('VinData', VinDataSchema);
