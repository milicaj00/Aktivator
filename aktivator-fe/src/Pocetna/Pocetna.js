import React from "react";
import { Box, Button, Grid } from "@mui/material";
import { NavLink } from "react-router-dom";

const Pocetna = () => {
  return (
    <Box className="container">
      <Box fullWidth className="pozadinaPoruka">
        <Box className="poruka"> Pokreni novu inicijativu! </Box>
        <NavLink to="/peticija" sx={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color = "primary"
            id="centralBtn"
            size="large"
            sx={{
              // backgroundColor: "secondary",
              minWidth: "20vw",
              minHeight: "10vh",
              fontSize: "1.2rem",
              mb: "1vh"
            }}
          >
            Aktiviraj se
          </Button>
        </NavLink>
      </Box>
    </Box>
  );
};

export default Pocetna;
