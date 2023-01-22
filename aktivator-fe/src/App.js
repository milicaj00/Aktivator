import { ThemeProvider } from "@emotion/react";
import { Button, CssBaseline } from "@mui/material";
import Navbar from "./Komponente/Navbar.js";
import LoginForma from "./Forme/LoginForma.js";
import RegistracijaForma from "./Forme/RegistracijaForma.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import BlogForma from "./Forme/BlogForma.js";
import PeticijaForma from "./Forme/PeticijaForma.js";
import Rute from "./Pocetna/Rute.js";
import { BrowserRouter, Router } from "react-router-dom";

function App() {
    console.log("NESTO");

    const logout = () => {
        localStorage.clear();
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <BrowserRouter>
                <Navbar />
                <LoginForma />
                <RegistracijaForma />
                {/* <LoginForma />
        <RegistracijaForma />
        <BlogForma />
        <PeticijaForma />
        <Button onClick={logout}> Izloguj se</Button> */}

                <Rute />
            </BrowserRouter>
        </>
    );
}

export default App;
