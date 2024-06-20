const Photo = require('../models/Photo');

exports.getAboutPage = (req, res) => {
    res.render('about');
};

exports.getEditPage = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    res.render('edit', {
        photo,
    });
};

exports.getAddPage = (req, res) => {
    res.render('add');
};

exports.getPageNotFound = (req, res) => {
    res.status(404).send('404 Page Not Found');
}