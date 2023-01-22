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
} from "@mui/material";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";
import axios from "axios";
import PotpisForma from "../Forme/PotpisForma";

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
  }, []);

  useEffect(() => {
    async function getPeticija() {
      return await axios
        .get("http://localhost:3005/api/peticija/singlePeticija/" + naslov)
        .then((data) => data);
    }
    const b = getPeticija();
    setPeticija(b);
    console.log(peticija);
  }, []);

  const potpisiPeticiju = async () => {
    console.log("NASLOV:");
    console.log({ naslov });
    if (user != null) {
      await axios
        .put("http://localhost:3005/api/peticija/addSignature", {
          naslov: naslov,
          user_name: user.name,
          user_surname: user.surname,
          user_email: user.email,
        })
        .then((res) => {
          console.log({ res });
          if (res.status === 200) {
            //IDE LOGIN NE ZNAM
            console.log("DOBROJE");
            notify();
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

  const notify = () => toast.success("Uspesno ste se ulogovali!");
  const notifyError = (text) => toast.error(text);

  return (
    <Box>
      <Card className="marginS">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <CardMedia
              sx={{ maxHeight: "50vh" }}
              component="img"
              crossorigin="anonymous"
              // src={PUTANJA + tr.slika}
              alt={naslov}
              className="trImg"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={8}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                {naslov}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {/* {tr.opis} */}
                "But I must explain to you how all this mistaken idea of
                denouncing pleasure and praising pain was born and I will give
                you a complete account of the system, and expound the actual
                teachings of the great explorer of the truth, the master-builder
                of human happiness. No one rejects, dislikes, or avoids pleasure
                itself, because it is pleasure, but because those who do not
                know how to pursue pleasure rationally encounter consequences
                that are extremely painful. Nor again is there anyone who loves
                or pursues or desires to obtain pain of itself, because it is
                pain, but because occasionally circumstances occur in which toil
                and pain can procure him some great pleasure. To take a trivial
                example, which of us ever undertakes laborious physical
                exercise, except to obtain some advantage from it? But who has
                any right to find fault with a man who chooses to enjoy a
                pleasure that has no annoying consequences, or one who avoids a
                pain that produces no resultant pleasure?"
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
        <PotpisForma />
      </Dialog>
    </Box>
  );
};

export default PeticijaVelika;
