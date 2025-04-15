const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required: true,
            trim: true
        },
        parent_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            default:null
        },
        image: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default:null,
            trim: true
        },
        status: {
            type: String,
            required: true,
            enum: ['active', 'inactive'],
            default: 'active'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Category', categorySchema);