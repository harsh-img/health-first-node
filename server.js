const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./router/auth');
const slider = require('./router/slider');
const category = require('./router/category');
const banner = require('./router/banner');
const brand = require('./router/brand');
const product = require('./router/product');
const frontend = require('./router/frontend');
const cors = require("cors"); 
const path = require('path');
dotenv.config();

const app = express();


const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/auth',router);
app.use('/api/slider',slider);
app.use('/api/category',category);
app.use('/api/banner',banner);
app.use('/api/brand',brand);
app.use('/api/product',product);
app.use('/api/frontend',frontend);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {   
    console.log('Connected to MongoDB');
    app.listen(3000, () => console.log('Server is running on port 3000'));
})
.catch((err) => {
    console.error('MongoDB connection error:', err.message);
});
