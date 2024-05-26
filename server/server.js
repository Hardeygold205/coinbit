const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
require('dotenv').config();


const mongourl = process.env.MONGODB_URL;

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: ['http://localhost:5173', 'http://172.20.10.3:5173'],
    optionsSuccessStatus: 200
}));

app.use(express.json());

mongoose.connect(mongourl, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    tls: true,
    tlsInsecure: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const DataSchema = new mongoose.Schema({
    inputValue: String
});

const Data = mongoose.model('Data', DataSchema);

app.post('/input', async (req, res) => {
    try {
        const { inputValue } = req.body;
        if (!inputValue) {
            return res.status(400).send('Input value is required');
        }
        const newData = new Data({ inputValue });
        await newData.save();
        res.status(200).send('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});