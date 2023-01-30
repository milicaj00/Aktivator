import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Grid, CardMedia, CardContent, Typography } from "@mui/material";
import { getBlog } from "../api";

const PUTANJA = "http://localhost:3005/";

const BlogVeliki = () => {
  let { naslov } = useParams();
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    getBlog(naslov, setBlog);
    
  }, []);

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
