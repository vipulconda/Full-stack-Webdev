const express=require('express')
const Routes=require('./Routes/auth')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')
const http = require('http');
const path = require('path');
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


const server = http.createServer(App);
wss.attach(server);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

