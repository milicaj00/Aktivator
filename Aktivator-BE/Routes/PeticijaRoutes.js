const express = require("express");
const router = express.Router();
const Peticija = require("../Controllers/PeticijaController");
const redisPeticija = require("../Controllers/RedisPeticija");
const helpers = require("../Controllers/helpers");

router.get(
    "/singlePeticija/:naslov",
    redisPeticija.getSinglePeticija,
    Peticija.getSinglePeticija
);
router.get("/findPeticija", redisPeticija.getPeticijas, Peticija.findPeticijas);
router.put("/addSignature", Peticija.editPeticija);
router.delete("/deletePeticija/:naslov", Peticija.deletePeticija);
router.post(
    "/addPeticija",
    helpers.upload.single("slika"),
    Peticija.addPeticija
);

module.exports = router;
