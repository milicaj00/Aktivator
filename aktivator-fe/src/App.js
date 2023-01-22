import { ThemeProvider } from "@emotion/react";
import { Button, CssBaseline } from "@mui/material";
import Navbar from "./Komponente/Navbar.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./stil.css";
import Rute from "./Pocetna/Rute.js";
import { BrowserRouter, Router } from "react-router-dom";
import React, { useEffect } from "react";

function App() {
    console.log("NESTO");

  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

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
  */}
        <Rute user={user} />
      </BrowserRouter>
    </>
  );
}

export default App;
