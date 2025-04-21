const mongoose = require('mongoose');

const productVarientSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    varient_id: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Varient',
          required: true,
        }
    ],
    varient_attribute_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'VarientAttribute',
            required: true,
        }
    ],
    price: {
        type: Number,
        required: true
    },
    discount_type: {
        type: String,
        enum: ['%','Rs'],
        default: '%'
    },
    discount_value:{
        type:Number,
        default:0
    },
    images: [
        {
          type: String,
        },
    ],
    stock: {
        type: Number,
        required: true
    },    
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive'],
        default: 'active'
    }
},{
    timestamps: true
}
)    

module.exports = mongoose.model('ProductVarient', productVarientSchema);
    