const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./router/auth');
const cors = require("cors"); 
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
