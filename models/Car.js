const mongoose = require('mongoose')

const CarSchema = new mongoose.Schema({
     title: { type: String, required: true },
     brand: { type: String, required: true },
     type: { type: String, required: true },
     kilometers: { type: Number, required: true },
     price: { type: Number, required: true },
     size: { type: Number, required: true },
     color: { type: String, required: true },
     image: { type: String }
});


const CarsModel = mongoose.model("Cars", CarSchema)
module.exports = CarsModel;



