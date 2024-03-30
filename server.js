// require
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const api = require('./routes/api');
const database = require('./config/connect');
const DistributorModel = require('./model/Distributor');

const app = express();
//Tạo port
const PORT = 3000;
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', api);
// connect db
database.connect();
//Chạy server
app.listen(PORT, () => {
    console.log(`Server is running the port ${PORT}`);
});

app.get('/', async (req, res) => {
    database.connect();
    let distributor = await DistributorModel.find();
    console.log(distributor);
    res.send(distributor)
})


