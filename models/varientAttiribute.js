const mongoose = require('mongoose');

const varientAttributeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    varient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Varient',
        required: true
    },
    color_code:{
        type:String
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    }
},{
    timestamps: true
}
)

module.exports = mongoose.model('VarientAttribute', varientAttributeSchema);