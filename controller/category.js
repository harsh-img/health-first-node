const categorySchema = require('../models/category');

const addCategory = async (req, res) => {
    try {
        const { name, description, parent_id } = req.body;
        const image = req.file ? req.file.filename : null;
        const categoryParentId = parent_id ? parent_id : null;

        const checkAlreadyExist = await categorySchema.findOne({ name });

        if(checkAlreadyExist){
            return res.status(400).json({
                message: "Category already exist",
                error: true
            });
        }

        const newCategory = await categorySchema.create({
            name,
            description,
            parent_id:categoryParentId,
            image
        });

        res.status(200).json({
            error: false,
            message: 'Category added successfully',
        });

    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message
        });
    }
};


const getCategory = async (req,res)=>{
    try{
        const getData = await categorySchema.find();

        if(!getData && getData.length == 0){
            return res.status(400).json({message: "No data found", error: false});
        }

        getData.forEach((data)=>{
            data.image = `${req.protocol}://${req.get('host')}/uploads/category/${data.image}`;
        })

        res.status(200).json({error: false, message: "Data fetched successfully", data: getData});
    }
    catch(err){
        res.status(500).json({error: true, message: err.message});
    }
}


module.exports = { addCategory ,getCategory}