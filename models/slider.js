const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
            trim: true        
        },
        url: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true 
    }
);

module.exports = mongoose.model('Slider', sliderSchema);