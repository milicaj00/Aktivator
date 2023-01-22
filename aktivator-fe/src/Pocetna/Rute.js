import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blog from "./Blog";
import Nalog from "./Nalog";
import Peticija from "./Peticija";
import Pocetna from "./Pocetna";

const Rute = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Pocetna />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/peticija" element={<Peticija />} />
                <Route path="/nalog" element={<Nalog />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Rute;
