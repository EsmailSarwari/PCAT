const express = require('express');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();

const photoController = require('./controllers/photoController');
const pagesController = require('./controllers/pagesController');

// Template Engine
app.set('view engine', 'ejs');

// DB Connection
const port = process.env.PORT || 4000;
mongoose
    .connect(
        'mongodb+srv://admin:Password@cluster1.qlkzvnz.mongodb.net/pcat-app?retryWrites=true&w=majority&appName=Cluster1'
    )
    .then(() => {
        console.log('DB Connected');
    })
    .catch((error) => {
        console.log('DB Connection Error:', error);
    });

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
    methodOverride('_method', {
        methods: ['POST', 'GET'],
    })
);

// Routes
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
