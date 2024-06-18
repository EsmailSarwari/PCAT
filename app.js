const express = require('express');
const mongoose = require('mongoose');
const Photo = require('./models/Photo');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const { dir } = require('console');

const port = 3000;
const app = express();
// DB Connection
mongoose.connect('mongodb://localhost/pcat-db');

// template engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

// routes
app.get('/', async (req, res) => {
    const photos = await Photo.find({});
    res.render('index', {
        photos,
    });
});
app.get('/photo/:id', async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('photo', {
        photo,
    });
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/add', (req, res) => {
    res.render('add');
});
app.get('*', (req, res) => {
    res.status(404).send('404 Page Not Found');
});
app.post('/photos', (req, res) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    let uploadPhoto = req.files.image;
    let uploadPath = __dirname + '/public/uploads/' + uploadPhoto.name;

    uploadPhoto.mv(uploadPath, async () => {
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadPhoto.name,
        });
        res.redirect('/');
    });
});

// Express & Port
app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});
