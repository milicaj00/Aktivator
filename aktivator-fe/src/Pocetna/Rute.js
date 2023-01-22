import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blog from "./Blog";
import Nalog from "./Nalog";
import Peticija from "./Peticija";
import Pocetna from "./Pocetna";
import BlogVeliki from "./BlogVeliki";
import PeticijaVelika from "./PeticijaVelika";

const Rute = () => {
  return (
    <Routes>
      <Route path="/" element={<Pocetna />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/peticija" element={<Peticija />} />
      <Route path="/nalog" element={<Nalog />} />
      <Route path="/blog/:naslov" element={<BlogVeliki />} />
      <Route path="/peticija/:naslov" element={<PeticijaVelika />} />
    </Routes>
  );
};

export default Rute;
