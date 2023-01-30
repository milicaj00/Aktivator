import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Box,
  Button,
  Dialog,
  Tooltip,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";
import axios from "axios";
import PotpisForma from "../Forme/PotpisForma";
import { getPeticija } from "../api";

const PUTANJA = "http://localhost:3005/";

const PeticijaVelika = () => {
  let { naslov } = useParams();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [peticija, setPeticija] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    getPeticija(naslov, setPeticija);
  }, []);

  const zapratiTag = (tag) => {};

  const potpisiPeticiju = async () => {
    console.log("NASLOV:");
    console.log(peticija.naslov);
    console.log(user);
    if (user != null) {
      await axios
        .put("http://localhost:3005/api/peticija/addSignature", {
          naslov: peticija.naslov,
          user_name: user.name,
          user_surname: user.surname,
          user_email: user.email,
        })
        .then((res) => {
          console.log({ res });
          if (res.status === 200) {
            console.log("DOBROJE");
            notify();
            getPeticija(naslov, setPeticija);
          }
        })
        .catch((error) => {
          if (error.response.status === 406) {
            notifyError(error.response.message);
            console.log(error.response.message);
          } else {
            console.log(error.response);
            notifyError("Doslo je do greske!");
          }
        });
    } else {
      handleOpen();
    }
  };

  const notify = () =>
    toast.success("Uspesno ste potpisali peticiju: " + peticija.naslov);
  const notifyError = (text) => toast.error(text);

  return (
    <Box>
      <Card className="marginS">
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <CardMedia
              sx={{ maxHeight: "50vh" }}
              component="img"
              src={peticija?.slika ? PUTANJA + peticija.slika : null}
              alt={naslov}
              className="trImg"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <CardContent>
              <Typography
                variant="h4"
                component="div"
                sx={{ textAlign: "center" }}
              >
                {peticija?.naslov}
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: "white",
                  margin: {sm:'0% 30%'},
                  backgroundColor: "#C53525",
                  padding: "0.5%",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                broj potpisa: {peticija?.broj_potpisa}
              </Typography>
              <Box
                className="cardCenter"
                sx={{ flexDirection: "row", flexWrap: "wrap" }}
              >
                {peticija?.tag.map((t, i) => (
                  <Tooltip key={i} title="Zaprati tag">
                    <Button onClick={zapratiTag(t)}>{t}</Button>
                  </Tooltip>
                ))}
              </Box>
              <Typography
                sx={{
                  mb: 1.5,
                  ml: 1.5,
                  mr: 1.5,
                  textAlign: "justify",
                }}
              >
                {peticija?.text}{" "}
              </Typography>
            </CardContent>
            <CardActions sx={{ flexGrow: "1", alignItems: "flex-end" }}>
              <Button
                fullWidth
                variant="contained"
                size="small"
                onClick={() => {
                  potpisiPeticiju();
                }}
              >
                Potpisi peticiju
              </Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <PotpisForma naslov={peticija?.naslov} />
      </Dialog>
    </Box>
  );
};

export default PeticijaVelika;
