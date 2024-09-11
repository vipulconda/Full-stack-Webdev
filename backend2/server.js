const express=require('express')
const Routes=require('./Routes/auth')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')
const http = require('http');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const App=express();
const wss = require('./websocketserver');
const mongoURI = process.env.MONGODB_URI;
console.log("Mongodb url",mongoURI)
PORT=3000;
mongoose.connect(mongoURI).then(()=>{
    console.log('mongodb connected');
}).catch((error)=>{
    console.error('error connecting mongodb :',error)
})

App.use(bodyParser.json())
const corsOptions = {
  origin: '*', // Replace with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Specify allowed HTTP methods
};
App.use(cors(corsOptions));
App.use(express.json());
App.get('/test', (req, res) => {
    res.send('Server is working');
  });
App.use('/',Routes);

const uploadsDir=path.join(__dirname, 'models', 'uploads')
App.get('/debug/files', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to read directory', error: err });
    }
    return res.json(files);
  });
});

App.use('/uploads', express.static(uploadsDir));
const server = http.createServer(App);
wss.attach(server);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});