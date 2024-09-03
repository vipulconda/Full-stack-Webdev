const express=require('express')
const Routes=require('./Routes/auth')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')
const http = require('http');
const path = require('path');

const App=express();
const wss = require('./websocketserver');
const mongoURI='mongodb://localhost:27017/edtech'
PORT=3000;
mongoose.connect(mongoURI).then(()=>{
    console.log('mongodb connected');
}).catch((error)=>{
    console.error('error connecting mongodb :',error)
})

App.use(bodyParser.json())
App.use(cors());
App.use(express.json());
App.get('/test', (req, res) => {
    res.send('Server is working');
  });
App.use('/',Routes);
App.use('/uploads', express.static(path.join(__dirname, 'models', 'uploads')));
const server = http.createServer(App);
wss.attach(server);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});