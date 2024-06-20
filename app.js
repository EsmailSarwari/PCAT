const express = require('express');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const fs = require('fs');
const Photo = require('./models/Photo');

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
app.use(methodOverride('_method'));

// routes
// Index page
app.get('/', async (req, res) => {
    const photos = await Photo.find({});
    res.render('index', {
        photos,
    });
});

// Photo Preview page
app.get('/photos/:id', async (req, res) => {
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

// Add New Photo to collection
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

// Photo Edit page
app.get('/photos/edit/:id', async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    res.render('edit', {
        photo,
    });
});

// update the selected photo
app.put('/photos/:id', async (req, res) => {
    const photo = await Photo.findById({ _id: req.params.id });
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.save();

    res.redirect(`/photos/${req.params.id}`);
});

app.get('*', (req, res) => {
    res.status(404).send('404 Page Not Found');
});

// Express & Port
app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});
