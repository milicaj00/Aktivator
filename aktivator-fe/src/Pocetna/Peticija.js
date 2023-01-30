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
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import PeticijaForma from "../Forme/PeticijaForma";
import { getMojePeticije, getPeticije } from "../api";
import { toast } from "react-toastify";
import { PeticijaGrid } from "../Komponente/PeticijaGrid";

const Peticija = () => {
  const [peticije, setPeticije] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    getPeticije(setPeticije);
  }, []);

  const seacrhPeticija = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const filter = "?filter=" + data.get("filter");
    console.log(filter);
    getPeticije(setPeticije, filter);
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
          flexWrap:"wrap",
          alignItems: "center",
          m: "5vh 5vw 0vh 5vw",
        }}
      >
        <Typography variant="h4" component="div">
          Peticije
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
      <Divider sx={{ m: "1vh 5vw" }}></Divider>
      <PeticijaGrid peticije={peticije} user = {user} moje ={false} />
      <Dialog open={open} onClose={handleClose}>
        <PeticijaForma />
      </Dialog>
    </Box>
  );
};

export default Peticija;
