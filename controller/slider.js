const sliderSchema = require('../models/slider');

const addSlider = async (req,res) => {

    try{

        const { url } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!image) {
            return res.status(400).json({ error: true, message: 'Image is required' });
        }

        const slider = await sliderSchema.create({image, url });
        res.status(201).json({error:false, message: 'Slider added successfully', slider });

    }catch(err){
        res.status(500).send({message:err.message})
    }

}

const getSlider = async (req, res) => {
    try {
        const sliders = await sliderSchema.find();
        const data = [];
        
        sliders.forEach((slider) => {
            data.push({
                _id: slider._id,
                image: `${req.protocol}://${req.get('host')}/uploads/slider/${slider.image}`, // adjust if your image is hosted elsewhere
                url: slider.url
            });
        });

        res.status(200).json({ 
            error: false, 
            message: 'Sliders fetched successfully', 
            sliders: data 
        });
    } catch (err) {
        res.status(500).json({ 
            error: true, 
            message: err.message 
        });
    }
};


module.exports = { addSlider ,getSlider};