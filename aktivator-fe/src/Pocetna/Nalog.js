import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getMojiBlogovi } from "../api";
import Peticija from "./Peticija";

const Nalog = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user"));
        setUser(u);
        getMojiBlogovi(null)
    }, []);

    return <Box>{user && <Peticija users={true} mojePeticije="Moje" />}</Box>;
};

export default Nalog;
