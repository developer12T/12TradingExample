const express = require('express');
const http = require('http');
const cors = require('cors')
const app = express();
const server = http.createServer(app);
const connectDB = require('./connect')
const {DataOrder} = require('./models')
const axios = require('axios')
app.use(cors())
app.use(express.json())

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.get('/getCommens',async (req,res)=>{

})
const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('socket connected')

    DataOrder.find().then((data) => {
        socket.emit('dataOrder', data);
    });

    socket.on('message', (data) => {
        io.emit('message', data)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })

    const checkForChanges = async () => {
        const data = await DataOrder.find();
        io.emit('dataOrder', data);
    };

    setInterval(checkForChanges, 1000);
})

app.get('/test', async (req, res) => {
    res.json('testkrub')
})

app.post('/addDataOrder', async (req, res) => {
    try {
        const newData = new DataOrder(req.body)
        const savedata = await newData.save()
        console.log(savedata)
        res.json('add complete')
    } catch (e) {
        res.json('error')
    }
})

app.get('/getDataOrder', async (req, res) => {
    const data = await DataOrder.find();
    io.emit('dataOrder', data);
    res.json(data)
})

app.put('/updateStatus', async (req, res) => {

    await DataOrder.updateMany({id: req.body.id}, {$set: {status: 'อนุมัติแล้ว'}})
    res.json('update Complete')
})

const graphApiUrl = 'https://graph.facebook.com/v18.0';

// Access Token ของแอป Facebook ของคุณ
const accessToken = 'EAAYNnOmtbuoBOxlwxznZANS6ygybQKg2G6YWZCUbwCy6tVI6BXUKtvR2KdiQlRGn2KC1Oz3n1ZA4lJVx26xznF2fZCcvAslLv3EVG1ZBEyf1XNd6GkE8uRKLfyPukxHSrukYTRcSo5l57hkx9cZCKnlHnzjBreKfjVZA1hYyLGfZBK42iNNSl3tGZBpZAZBaKMoHsZCBbITcuXZBEdZCoVk0A16RFfilY4uZB3ZAZCfRtHtcoftpZAGatMvtOLqPyESS8WW1ZCQyeADmSZCtKdF0HhgZD';

app.get('/getComments', async (req, res) => {
    try {
        const postId = 'pfbid02f2QimpHrcn8Tup238CmjzpPuzu7FsrTDR5T7Seezmf6wVVcGAiXbjWsP6QWFs4PZl'; // ระบุ ID ของโพสต์ที่คุณต้องการดึง Comment
        const response = await axios.get(`${graphApiUrl}/${postId}/comments?access_token=${accessToken}`);

        const comments = response.data.data;
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึง Comment' });
    }
});
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`server start on port ${PORT}`);
    })
}).catch((error) => {
    console.error('Error connecting to the database:', error)
})