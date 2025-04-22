const productSchema = require('../models/product');
const productVarientSchema = require('../models/productVarient');
const varientSchema = require('../models/varient');
const varientAttributeSchema = require('../models/varientAttiribute');


const getProductDetail = async (req, res) => {
    try {
        const productId = req.params.id;

        // Get main product with populated category and brand names
        const product = await productSchema.findById(productId)
            .populate('category_id', 'name')  // Only get 'name' field
            .populate('brand_id', 'name');

        if (!product) {
            return res.status(404).json({ error: true, message: "Product not found" });
        }

        // Get all variants for the product
        const productVariants = await productVarientSchema.find({ product_id: productId });

        // Get variant schema info
        const varients = await varientSchema.find({ _id: { $in: product.varient_id } });

        // Get unique attribute IDs from all productVariants
        const allAttrIds = productVariants.flatMap(pv => pv.varient_attribute_id);
        const uniqueAttrIds = [...new Set(allAttrIds.map(id => id.toString()))];

        const varientAttributes = await varientAttributeSchema.find({ _id: { $in: uniqueAttrIds } });

        // Group variant attributes by variant name
        const groupedVariants = varients.map(variant => {
            const attributesForVariant = varientAttributes.filter(attr => attr.varient_id.toString() === variant._id.toString());
            return {
                [variant.name]: attributesForVariant.map(attr => attr.name)
            };
        });

        // Format only the first variant if available
        const initialVariant = productVariants.length > 0 ? {
            ...productVariants[0].toObject(),
            images: productVariants[0].images.map(img => `${req.protocol}://${req.get('host')}/uploads/products/${img}`)
        } : {};

        // Build final data with category/brand name and initial variant
        const data = {
            _id: product._id,
            name: product.name,
            description: product.description,
            short_description: product.short_description,
            category_id: product.category_id._id,
            category_name: product.category_id.name,
            brand_id: product.brand_id._id,
            brand_name: product.brand_id.name,
            status: product.status,
            faq: JSON.parse(product.faq),
            rating:5,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            variants: groupedVariants,
            product_type:product.product_type,
            ...initialVariant  // Merge initial variant directly into the response
        };

        return res.status(200).json({
            error: false,
            message: "Product Details fetched successfully",
            data
        });

    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
};




const getProduct = async (req, res) => {
    try {
        const params = req.query;
        console.log(params.type);
        let data = productSchema.find();

        if (params.type) {
            data = data.where('status').equals('active').where(params.type).equals('active');
        }

        data = data.populate([
            { path: 'category_id', select: 'name' },
            { path: 'varient_id', select: 'name' },
            { path: 'brand_id', select: 'name' }
        ]);

        data = await data.exec();

        const result = [];

        for (const product of data) {
            const productVariant = await productVarientSchema
                .findOne({ product_id: product._id }) 
                .lean();

            if (productVariant) {
                result.push({
                    _id: product._id,
                    name: product.name,
                    category: product.category_id?.name || null,
                    brand: product.brand_id?.name || null,
                    variant_names: product.varient_id.map(v => v.name),
                    price: productVariant.price,
                    stock: productVariant.stock,
                    discount_type: productVariant.discount_type,
                    discount_value: productVariant.discount_value,
                    top_selling:product.top_selling,
                    featured:product.featured,
                    popular:product.popular,
                    status:product.status,
                    rating:5,
                    images: productVariant.images.map(image => `${req.protocol}://${req.get('host')}/uploads/products/${image}`),
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt
                });
            }                
        }

        return res.status(200).json({
            error: false,
            message: "Products with first variant fetched successfully",
            data: result
        });
  
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
};
  
  
  

module.exports = { getProductDetail ,getProduct};