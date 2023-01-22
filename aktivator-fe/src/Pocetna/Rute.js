import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Blog from "./Blog";
import Nalog from "./Nalog";
import Peticija from "./Peticija";
import Pocetna from "./Pocetna";
import BlogVeliki from "./BlogVeliki";
import PeticijaVelika from "./PeticijaVelika";
import LoginForma from "../Forme/LoginForma";
import RegistracijaForma from "../Forme/RegistracijaForma";

const Rute = ({ user }) => {
  console.log(user);
  return (
    <Routes>
      <Route path="/" element={<Pocetna />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/peticija" element={<Peticija />} />
      <Route path="/nalog" element={<Nalog />} />
      <Route path="/blog/:naslov" element={<BlogVeliki />} />
      <Route path="/peticija/:naslov" element={<PeticijaVelika />} />
      <Route path='/login' element=
                {user ? <Navigate replace to="/nalog" /> : <LoginForma />} />

              <Route path='/signup' element=
                {user ? <Navigate replace to="/nalog" /> : <RegistracijaForma />} />

    </Routes>
  );
};

export default Rute;
