if(process.env.NODE_ENV == 'development'){
    var dotenv = require('dotenv');
    dotenv.config()
}
import express ,{ Application } from 'express';
import path from 'path';

// Configure express
const app : Application = express();

// Define port
const PORT : number = Number(process.env.PORT) || 3000;

// API routes
app.use('/api', require('./api_routes'))

// Use Express Static middleware to handle angular pages requests
app.use(express.static(path.join(__dirname, 'angular-dist')));


// Start server
app.listen(PORT, ()=>{
    console.log(`Server run at port ${PORT}`);
})

module.exports.app = app;