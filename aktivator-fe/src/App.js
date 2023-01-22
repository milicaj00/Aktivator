import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import Navbar from "./Komponente/Navbar.js";
import LoginForma from "./Forme/LoginForma.js";
import RegistracijaForma from "./Forme/RegistracijaForma.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import BlogForma from "./Forme/BlogForma.js";
import PeticijaForma from "./Forme/PeticijaForma.js";

function App() {
  console.log("NESTO");

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
      <Navbar />
      <LoginForma/>
      <RegistracijaForma />
      <BlogForma/>
      <PeticijaForma/>
      
    </>
  );
}

export default App;
