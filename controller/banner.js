const bannerSchema = require('../models/banner');

const addBanner = async (req,res) => {

    try{

        const { url } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!image) {
            return res.status(400).json({ error: true, message: 'Image is required' });
        }

        const banner = await bannerSchema.create({image, url });
        res.status(201).json({error:false, message: 'Banner added successfully' });

    }catch(err){
        res.status(500).json({error:true,message:err.message})
    }

}

const getBanner = async (req, res) => {
    try {
        const banners = await bannerSchema.find();
        banners.forEach((banner) => {
            banner.image= `${req.protocol}://${req.get('host')}/uploads/banner/${banner.image}`
        });

        res.status(200).json({ 
            error: false, 
            message: 'Banners fetched successfully', 
            data: banners 
        });
    } catch (err) {
        res.status(500).json({ 
            error: true, 
            message: err.message 
        });
    }
};


module.exports = { addBanner ,getBanner};