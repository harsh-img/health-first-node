const productSchema = require('../models/product');
const productVarientSchema = require('../models/productVarient');
const varientSchema = require('../models/varient');
const varientAttributeSchema = require('../models/varientAttiribute');
const categorySchema = require('../models/category');
const brandSchema = require('../models/brand');
const Joi = require('joi');
const slugify = require('slugify');
const mongoose = require('mongoose');

//Product
const createProduct = async (req,res) =>{

    try{

        const data = req.body;

        const productSchemas = Joi.object({
            name: Joi.string().required(),
            category_id: Joi.string().required(),
            varient_id: Joi.array().required(),
            brand_id: Joi.string().required(),
            product_tags: Joi.array().items(Joi.string()).optional(),
            product_type: Joi.string().optional(),
            faq: Joi.array().optional(),
            description: Joi.string().optional(),
            short_description: Joi.string().optional()
        });

        const { error, value } = productSchemas.validate(req.body);

        if (error) {
            return res.status(400).json({
              error: true,
              message: error.details[0].message
            });
        }

        const checkCategoryExist = await categorySchema.findById({
            _id:data.category_id
        });
        
        const checkBrandExist = await brandSchema.findById({
            _id:data.brand_id
        });
        
        const checkVarientExist = await varientSchema.find({
            _id:{$in:data.varient_id}
        });

        if (checkVarientExist.length !== data.varient_id.length) {
            return res.status(400).json({
              error: true,
              message: "One or more varient IDs are invalid"
            });
        }

        if(!checkCategoryExist || !checkBrandExist){
            const msg = !checkCategoryExist ? "Category" :"Brand";
            return res.status(400).json({error:true,message:`${msg} not found`});
        }

        const checkAlreadyExist = await productSchema.findOne({
            name:data.name,
            category_id:data.category_id
        });

        if(checkAlreadyExist){
            return res.status(400).json({error:true,message:"Product already exist"});
        }

        const encodeFaq = JSON.stringify(data.faq);

        await productSchema.create({
            name:data.name,
            slug:slugify(data.name, { lower: true }),
            category_id:data.category_id,
            varient_id:data.varient_id,
            brand_id:data.brand_id,
            product_tags:data.product_tags,
            product_type:data.product_type,
            faq:encodeFaq,
            description:data.description,
            short_description:data.short_description
        });

        return res.status(200).json({error:false,message:"Product created successfully"});

    }catch(err){
        return res.status(500).json({error:true,message:err.message});
    }
}

const getProduct = async (req,res) =>{
    try{

        const params = req.query;

        let data = productSchema.find();

        if(params.type){
           data = data.where('status').equals('active').where(params.type).equals('active');
        }

        data = data.populate(
            [
                {
                    path:'category_id',select:"name"
                },
                {
                    path:"varient_id",select:"name"
                },
                {
                    path:"brand_id",select:"name"
                }
            ]
        );

        data = await data.exec();

        return res.status(200).json({error:false,message:"Product fetched successfully",data});

    }catch(err){
        return res.status(500).json({error:true,message:err.message});
    }
}

// product varient

const createProductVarient = async (req, res) => {
    try {
        const productId = req.params.id;
        const images = req.files ? req.files.map(file => file.filename) : [];
        const data = req.body;

        const getProduct = await productSchema.findById(productId);
        if (!getProduct) {
            return res.status(400).json({ error: true, message: "Product not found" });
        }
  
        let rawAttrIds = [];
        if (Array.isArray(data.varient_attribute_id)) {
            rawAttrIds =data.varient_attribute_id.split(',');
        } else if (typeof data.varient_attribute_id === 'string') {
            rawAttrIds = data.varient_attribute_id.split(',');
        }   

      
        if (!rawAttrIds || rawAttrIds.length !== getProduct.varient_id.length) {
            return res.status(400).json({ error: true, message: "One or more varient attribute IDs are invalid or missing" });
        }
  
        const checkAlreadyExist = await productVarientSchema.findOne({
            product_id: productId,
            varient_id: getProduct.varient_id,
            varient_attribute_id: { $all: rawAttrIds.map(id => new mongoose.Types.ObjectId(id)) }
        });
    
        if (checkAlreadyExist) {
            return res.status(400).json({ error: true, message: "Product varient already exists" });
        }
    
        await productVarientSchema.create({
            product_id: productId,
            varient_id: getProduct.varient_id,
            varient_attribute_id: rawAttrIds,
            price: data.price,
            stock: data.stock,
            discount_type: data.discount_type,
            discount_value: data.discount_value,
            images: images
        });
  
        return res.status(200).json({ error: false, message: "Product varient created successfully" });
  
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
};

const getProductVarient = async (req, res) => {
    try {
        const productId = req.params.id;

        const data = await productVarientSchema
            .find({ product_id: productId })
            .populate("varient_id", "name")
            .populate("varient_attribute_id", "name")
    
        return res.status(200).json({ error: false, message: "Product varient fetched successfully", data });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
};
  
//varient
const createVarient = async (req,res) =>{

    try{

        const data = req.body;

        const checkAlreadyExist = await varientSchema.findOne({name:data.name});

        if(checkAlreadyExist){
            return res.status(400).json({error:true,message:"Varient already exist"});
        }

        await varientSchema.create({name:data.name});

        return res.status(200).json({error:false,message:"Varient created successfully"});

    }catch(err)
    {
        return res.status(500).json({error:true,message:err.message});
    }
}

const getVarient = async (req,res)=>{
    try{

        const data = await varientSchema.find();
        return res.status(200).json({error:false,data});

    }catch(err){
        return res.status(500).json({error:true,message:err.message});
    }
}

//varient attirbute
const createVarienAttribute = async (req,res) =>{
    try{

        const data = req.body;

        const checkVarientExist = await varientSchema.findOne({
            _id:data.varient_id
        });

        if(!checkVarientExist) return res.status(400).json({error:true,message:"Varient not found"});
        
        const checkAlreadyExist = await varientAttributeSchema.findOne({
            name:data.name,
            varient_id:data.varient_id
        });

        if(checkAlreadyExist) return res.status(400).json({error:true,message:"Varient attribute already exist"});
        
        await varientAttributeSchema.create(
            {
                name:data.name,
                varient_id:data.varient_id,
                color_code:data.color_code
            }
        );

        return res.status(200).json({error:false,message:"Varient attribute created successfully"});

    }catch(err){
        return res.status(500).json({error:true,message:err.message});
    }
}

const getVarientAttribute = async (req,res) =>{
    try{

        const data = await varientAttributeSchema.find().populate({
            path: 'varient_id',
            select: 'name'
        });

        return res.status(200).json({error:false,data});

    }catch(err){
        return res.status(500).json({error:true,message:err.message});
    }
}


module.exports = {
    createVarient,
    getVarient,
    createVarienAttribute,
    getVarientAttribute,
    createProduct,
    getProduct,
    createProductVarient,
    getProductVarient
}