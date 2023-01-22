import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Grid,
  Typography,
  Box,
  InputBase,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";

const PUTANJA = "http://localhost:3005/";

const Peticija = () => {
  const [peticije, setPeticije] = useState([]);

  useEffect(() => {
    async function getPeticije() {
      await axios
        .get("http://localhost:3005/api/peticija/findPeticija")
        .then((data) => {
          console.log({ data });
          setPeticije(data.data);
        });
    }
    getPeticije();
  }, []);

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  const prikaziVise = () => {};

  return (
    <Box>
      <Box>
        <Typography variant="h4" component="div">
          Peticije
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Box>
      <Box>
        {peticije.map((p, i) => (
          <Card key={i} className="marginS">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <CardMedia
                  sx={{ maxHeight: "50vh" }}
                  component="img"
                  src={PUTANJA + p.slika}
                  alt={p.naziv}
                  className="pImg"
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
                    {p.naslov}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {p.text.substring(0, 100)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ flexGrow: "1", alignItems: "flex-end" }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={prikaziVise}
                  >
                    Prikazi vise
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Peticija;
