const express = require("express");
const router = express.Router();
const Peticija = require("../Controllers/PeticijaController");

router.get("/allPeticijas", Peticija.getAllPeticijas);
router.get("/singlePeticija/:naslov", Peticija.getSinglePeticija);
router.get("/findPeticija/:tag", Peticija.findPeticijas);
router.put("/editPeticija/:naslov", Peticija.editPeticija);
router.delete("/deletePeticija/:naslov", Peticija.deletePeticija);
router.post("/addPeticija", Peticija.addPeticija);

module.exports = router;
