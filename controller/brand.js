const brandSchema = require('../models/brand');

const addBrand = async (req,res)=>{

    try{

        const { name } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!image) {
            return res.status(400).json({ error: true, message: 'Image is required' });
        }

        const brand = await brandSchema.create({name, image});
        res.status(201).json({error:false, message: 'Brand added successfully'});

    }catch(err){
        res.status(500).json({error: true, message: err.message})
    }
}

const getBrand = async (req, res) => {
    try {

        const brands = await brandSchema.find();

        if(!brands && brands.length == 0){
            return res.status(400).json({message: "No data found", error: false});
        }

        brands.forEach((brand) => {
            brand.image = `${req.protocol}://${req.get('host')}/uploads/brand/${brand.image}`;
        })

        res.status(200).json({error: false, message: "Data fetched successfully", data: brands});

    }catch(err){
        res.status(500).json({error: true, message: err.message})
    }
}

module.exports = { addBrand,getBrand }