const http = require('http');
require('dotenv').config();
const https = require('https');
const fs = require('fs');


const app = require('./app');

const { mongoConnect } = require('./services/mongo');

const PORT = process.env.PORT || 8000;


const server = http.createServer(app); 

//{
    //key: fs.readFileSync('/etc/letsencrypt/live/api.lanuderia.com/privkey.pem'), 
    //cert: fs.readFileSync('/etc/letsencrypt/live/api.lanuderia.com/fullchain.pem')
//},


async function startServer() {

    await mongoConnect();


    server.listen(PORT, () => {
        console.log(`Server running at PORT ${PORT}...`)
    });

};

startServer();