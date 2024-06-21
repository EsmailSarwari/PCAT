const express = require('express');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const photoController = require('./controllers/photoController');
const pagesController = require('./controllers/pagesController');

const app = express();
// template engine
app.set('view engine', 'ejs');

// DB Connection
const port = 3000;
mongoose.connect('mongodb://localhost/pcat-db');

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
    methodOverride('_method', {
        methods: ['POST', 'GET'],
    })
);

// photo controllers
app.get('/', photoController.getAllPhoto);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

// pages controllers
app.get('/about', pagesController.getAboutPage);
app.get('/photos/edit/:id', pagesController.getEditPage);
app.get('/add', pagesController.getAddPage);
app.get('*', pagesController.getPageNotFound);

// Express & Port
app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});
