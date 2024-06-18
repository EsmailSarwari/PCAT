const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;

async function main() {
    // Create Photo Shcema
    const photoSchema = new Schema({
        title: String,
        description: String,
        image: String,
        dateCreated: {
            type: Date,
            default: Date.now(),
        },
    });

    // Create Photo Model/ Create the collection basec on the created schema
    const Photo = Model('photo', photoSchema);
    module.exports = Photo;
}
main();
