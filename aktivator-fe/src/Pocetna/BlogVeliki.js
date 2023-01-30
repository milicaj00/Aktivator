import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Grid, CardMedia, CardContent, Typography,Tooltip ,Box,Button } from "@mui/material";
import { getBlog } from "../api";
import { toast } from "react-toastify";
import axios from "axios";

const PUTANJA = "http://localhost:3005/";
const WS_URL = "ws://127.0.0.1:3400";

const BlogVeliki = () => {
  let { naslov } = useParams();
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState(null);

  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    getBlog(naslov, setBlog);
    
  }, []);

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
    <Card sx={{ margin: "5vw" }} elevation={3}>
      <Grid container>
        <Grid item xs={12} md={4}>
          <CardMedia
            component="img"
            className="trImg"
            src={blog?.slika ? PUTANJA + blog?.slika : null}
            alt={naslov}
            height="250"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              align="center"
            >
              {naslov}
            </Typography>
            <Typography
                  sx={{ mb: 1.5, textAlign:'center' }}
                  variant="body2"
                  color="text.secondary"
                >
                  {blog?.vlasnik.name} {blog?.vlasnik.surname}
                </Typography>
              <Box
                className="cardCenter"
                sx={{ flexDirection: "row", flexWrap: "wrap" }}
              >
                {blog?.tag.map((t, i) => (
                  <Tooltip key={i} title="Zaprati tag">
                    <Button onClick={()=>zapratiTag(t)}>{t}</Button>
                  </Tooltip>
                ))}
              </Box>
            <Typography
              variant="body1"
              align="justify"
              sx={{ padding: "2vh 3vw" }}
            >
              {blog?.text}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default BlogVeliki;
