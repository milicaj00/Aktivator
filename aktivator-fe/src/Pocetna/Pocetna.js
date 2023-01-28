import React from "react";
import { Box, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import CampaignIcon from "@mui/icons-material/Campaign";

const Pocetna = () => {
  return (
    <Box className="container" sx={{ marginBottom: "10%" }}>
      <Box fullWidth className="pozadinaPoruka">
        <Box className="poruka"> Pokreni novu inicijativu! </Box>
        <NavLink to="/peticija" sx={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            id="centralBtn"
            size="large"
            sx={{
              backgroundColor: "secondary.contrastText",
              minWidth: "20vw",
              minHeight: "10vh",
              fontSize: "1.2rem",
              bm: "1vh"
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
