import { Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Peticija from "./Peticija";

const Nalog = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

  return (
    <Box>
        {user && <Peticija filter={"?filter=" + user.name + user.surname} mojePeticije={"Moje"}/>}
    </Box>
  );
};

export default Nalog;
