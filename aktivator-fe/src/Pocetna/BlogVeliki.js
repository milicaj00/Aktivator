import React from "react";
import { useParams } from "react-router-dom";
import { Card, Grid, CardMedia, CardContent, Typography } from "@mui/material";


//http://localhost:3000/api/blog/singleBlog/treci blog
const BlogVeliki = () => {
  let { naslov } = useParams();

  return (
    <Card sx={{ margin: "5vw" }} elevation={3}>
      <Grid container>
        <Grid item xs={12} md={4}>
          <CardMedia
            component="img"
            className="trImg"
            // image={blog.slika}
            src="https://srd-pescenica.hr/wp-content/uploads/2016/03/Savica-8.jpg"
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
              {/* {" "}
              {blog.tekst}{" "} */}
              "But I must explain to you how all this mistaken idea of
              denouncing pleasure and praising pain was born and I will give you
              a complete account of the system, and expound the actual teachings
              of the great explorer of the truth, the master-builder of human
              happiness. No one rejects, dislikes, or avoids pleasure itself,
              because it is pleasure, but because those who do not know how to
              pursue pleasure rationally encounter consequences that are
              extremely painful. Nor again is there anyone who loves or pursues
              or desires to obtain pain of itself, because it is pain, but
              because occasionally circumstances occur in which toil and pain
              can procure him some great pleasure. To take a trivial example,
              which of us ever undertakes laborious physical exercise, except to
              obtain some advantage from it? But who has any right to find fault
              with a man who chooses to enjoy a pleasure that has no annoying
              consequences, or one who avoids a pain that produces no resultant
              pleasure?"
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default BlogVeliki;
