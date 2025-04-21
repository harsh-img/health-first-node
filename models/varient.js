const mangoose = require('mongoose');

const varientSchema = new mangoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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

module.exports = mangoose.model('Varient', varientSchema);