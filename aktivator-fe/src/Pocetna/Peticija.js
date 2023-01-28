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
  Dialog,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import PeticijaForma from "../Forme/PeticijaForma";

const PUTANJA = "http://localhost:3005/";

const Peticija = ({ filterKorisnik = "", mojePeticije = "" }) => {
  const [peticije, setPeticije] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  let navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    getPeticije();
  }, []);

  const zapratiTag = (tag) => {};

  async function getPeticije(filter = "") {
    await axios
      .get("http://localhost:3005/api/peticija/findPeticija" + filter)
      .then((data) => {
        console.log(data.data);
        setPeticije(data.data);
      });
  }
  const seacrhPeticija = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const filter = "?filter=" + data.get("filter");
    console.log(filter);
    getPeticije(filter);
  };

  const Search = styled("form")(({ theme }) => ({
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          mt: "5%",
        }}
      >
        <Typography variant="h4" component="div">
          {mojePeticije.length !== 0 && "Moje"} Peticije
        </Typography>
        {user && (
          <Button
            variant="contained"
            onClick={() => {
              handleOpen();
            }}
          >
            Napravi Peticiju
          </Button>
        )}
        <Search onSubmit={seacrhPeticija}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            name="filter"
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
                  <Typography variant="h4" component="div">
                    {p.naslov}
                  </Typography>
                  <Box>
                    {p.tag.map((t) => (
                      <Tooltip title="Zaprati tag">
                        <Button onClick={zapratiTag(t)}>{t}</Button>
                      </Tooltip>
                    ))}
                  </Box>
                  <Typography sx={{ mb: 1.5 }}>
                    {p.text.substring(0, 500)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ flexGrow: "1", alignItems: "flex-end" }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={() => {
                      navigate(`/peticija/${p.naslov}`, { state: p });
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
      <Dialog open={open} onClose={handleClose}>
        <PeticijaForma />
      </Dialog>
    </Box>
  );
};

export default Peticija;
