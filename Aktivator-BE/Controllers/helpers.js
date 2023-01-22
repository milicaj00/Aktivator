const path = require("path");
const sharp = require("sharp");
const multer = require("multer");

exports.upload = multer({});

exports.makeImage = async (file, fileName) => {
    const imagePath = "./Photos";
    if (!file) {
        return false;
    }

    const fileext = file.originalname.split(".").slice(-1);

    const filepath = path.resolve(`${imagePath}/${fileName}.${fileext}`);
    await sharp(file.buffer)
        .resize(300, 300, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        })
        .toFile(filepath);

    return true;
};
