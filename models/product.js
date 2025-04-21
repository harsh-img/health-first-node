const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug:{
            type:String,
            unique: true,
            lowercase: true,
            trim: true
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        varient_id: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Varient',
            required: true
        }],
        brand_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: true
        },
        product_tags: [
            {
                type: String,
                default: null
            }
        ],
        faq:{
            type: String,
            default: null
        },
        product_type:{
            type:String,
            enum:['new','refurnished'],
            default:'new'
        },
        short_description:{
            type:String,
            default: null,
            trim: true
        },
        description: {
            type: String,
            default: null,
            trim: true
        },
        status: {
            type: String,
            required: true,
            enum: ['active', 'inactive'],    
            default: 'active'
        },
        top_selling: {
            type: String,
            required: true,
            enum: ['active', 'inactive'],    
            default: 'active'
        },
        popular: {
            type: String,
            required: true,
            enum: ['active', 'inactive'],    
            default: 'active'
        },
        featured: {
            type: String,
            required: true,
            enum: ['active', 'inactive'],    
            default: 'active'
        },
    },
    {
        timestamps: true 
    }
);

module.exports = mongoose.model('Product', productSchema);
        