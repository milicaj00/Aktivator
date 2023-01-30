import { ThemeProvider } from "@emotion/react";
import { Button, CssBaseline } from "@mui/material";
import Navbar from "./Komponente/Navbar.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./stil.css";
import Rute from "./Pocetna/Rute.js";
import { BrowserRouter, Router } from "react-router-dom";
import React, { useEffect } from "react";
import { lightTheme } from "./Komponente/Theme.js";

function App() {
    const [user, setUser] = React.useState(null);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user"));
        setUser(u);
    }, []);

    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
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
                    <Navbar user={user} />
                    <Rute user={user} />
                </BrowserRouter>
            </>
        </ThemeProvider>
    );
}

export default App;
