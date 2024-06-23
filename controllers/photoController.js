const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhoto = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const photosPerPage = 3;
        const totalPhoto = await Photo.find({}).countDocuments();
        const photos = await Photo.find({})
            .sort('-dateCreated')
            .skip((page - 1) * photosPerPage)
            .limit(photosPerPage);

        res.render('index', {
            photos: photos,
            current: page, // current active pagination page
            pages: Math.ceil(totalPhoto / photosPerPage), // number of pages
        });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

exports.getPhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('photo', {
        photo,
    });
};

exports.createPhoto = (req, res) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    let uploadPhoto = req.files.image;
    let uploadPath = __dirname + '/../public/uploads/' + uploadPhoto.name;

    uploadPhoto.mv(uploadPath, async () => {
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadPhoto.name,
        });
        res.redirect('/');
    });
};

exports.updatePhoto = async (req, res) => {
    const photo = await Photo.findById({ _id: req.params.id });
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.save();

    res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    let deletedImage = __dirname + '/../public' + photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndDelete({ _id: req.params.id });
    res.redirect('/');
};
