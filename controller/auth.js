const userSchema = require('../models/auth');
const {generateToken} = require('../utils/token');
const bcrypt = require('bcrypt');
const contactSchema = require('../models/contact');

const register = async (req,res) => {
   
    const {name,email,mobile,password} = req.body;

    const existingUser = await userSchema.findOne({ 
        $or: [{ email }, { mobile }]
      });
      
    if (existingUser) {
        return res.status(400).json({
            message: existingUser.email === email 
            ? "Email already exists" 
            : "Mobile number already exists",
            error: true
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userSchema.create({
        name,
        email,
        mobile,
        password:passwordHash
    });

    return res.status(200).json({
        message: "User registered successfully",
        error: false,
        user:user,
        token: generateToken(user)
    });
}

const login = async (req,res) => {
    const {email,password} = req.body;
    const user = await userSchema.findOne({email});
    if(!user){
        return res.status(400).json({
            message: "User not found",
            error: true
        });
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid password",
            error: true
        });
    }
    return res.status(200).json({
        message: "User logged in successfully",
        error: false,
        user:user,
        token: generateToken(user)
    });
}

const contact = async (req,res) => {

    try{

        const { name, email, subject, description } = req.body;

        const contact = await contactSchema.create({
            name,
            email,
            subject,
            description
        });

        return res.status(200).json({
            message: "Contact created successfully",
            error: false,
            contact: contact
        });

    }catch(err){

        return res.status(400).json({
            message: err.message,
            error: true
        });
    }

}

module.exports = {
    register,
    login,
    contact
}