import React from "react";
import axios from "axios";
import {
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteBlog, getMojiBlogovi } from "../api";


const PUTANJA = "http://localhost:3005/";
const WS_URL = "ws://127.0.0.1:3400";

export const BlogGrid = ({ sBlogovi, blogovi, user, moje }) => {
  let navigate = useNavigate();


  const notifyError = (message) => toast.error(message);

  const zapratiTag = async (tag) => {
    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = (event) => {
        const msg = {
          id: user.id,
          tag: tag,
          init: false,
        };
        ws.send(JSON.stringify(msg));
      };
    } catch (err) {
      console.log(err);
      notifyError("Doslo je do greske!");
      return;
    }

    await axios
      .put("http://localhost:3005/api/user/subscribe", {
        id: user.id,
        tag: tag,
      })
      .then((data) => {
        if (data.status === 200) {
          console.log("Uspesno ste zapratili tag: " + tag);
        }
      })
      .catch((err) => {
        console.log(err.response);
        notifyError("Doslo je do greske!");
      });
  };

  return (
    <Box>
      {blogovi.map((b, i) => (
        <Card key={i} className="marginS">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CardMedia
                sx={{ maxHeight: "50vh" }}
                component="img"
                src={PUTANJA + b.slika}
                alt={b.naziv}
                className="trImg"
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent>
                <Box sx ={{display: 'flex', justifyContent:'space-between'}}>
                  <Typography variant="h4" component="div">
                    {b.naslov}
                  </Typography>
                  {moje == true && <Button color ="secondary" variant="outlined" startIcon={<DeleteIcon />} onClick= {async () => {await deleteBlog(b.naslov); await getMojiBlogovi(sBlogovi);  }}>Obrisi</Button>}
                </Box>
                <Typography
                  sx={{ mb: 1.5 }}
                  variant="body2"
                  color="text.secondary"
                >
                  {b.vlasnik.name} {b.vlasnik.surname}
                </Typography>
                <Box>
                  {b.tag.map((t, i) => (
                    <Tooltip key={i} title="Zaprati tag">
                      <Button onClick={() => zapratiTag(t)}>{t}</Button>
                    </Tooltip>
                  ))}
                </Box>
                <Typography sx={{ mb: 1.5 }}>
                  {b.text.substring(0, 500)}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  flexGrow: "1",
                  alignItems: "flex-end",
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  onClick={() => {
                    navigate(`/blog/${b.naslov}`, {
                      state: b,
                    });
                  }}
                >
                  Prikazi vise
                </Button>
              </CardActions>
            </Grid>
          </Grid>
        </Card>
      ))}
    </Box>
  );
};
