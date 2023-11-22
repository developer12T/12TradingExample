const mongoose = require('mongoose')

const  CONNECT_STRING  = 'mongodb://127.0.0.1:27017/testnoti'

const connectDB = async () => {
    try {
        await mongoose.connect(CONNECT_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB Success')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        throw error
    }
};

module.exports = connectDB