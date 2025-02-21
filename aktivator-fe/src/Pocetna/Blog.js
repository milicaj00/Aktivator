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
import BlogForma from "../Forme/BlogForma";
import { toast } from "react-toastify";
import { BlogGrid } from "../Komponente/BlogGrid";

const WS_URL = "ws://127.0.0.1:3400";
const PUTANJA = "http://localhost:3005/";

const Blog = () => {
    const [blogovi, setBlog] = useState([]);
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);

    let navigate = useNavigate();

    const notify = message => toast.success(message);
    const notifyError = message => toast.error(message);

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
        getBlog();
    }, []);

    const zapratiTag = async tag => {
        try {
            const ws = new WebSocket(WS_URL);

            ws.onopen = event => {
                const msg = {
                    id: user.id,
                    tag: tag,
                    init: false
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
                tag: tag
            })
            .then(data => {
                if (data.status === 200) {
                    notify("Uspesno ste zapratili tag: " + tag);
                }
            })
            .catch(err => {
                console.log(err.response);
                notifyError("Doslo je do greske!");
            });
    };

    async function getBlog(filter = "") {
        await axios
            .get("http://localhost:3005/api/blog/findBlog" + filter)
            .then(data => {
                console.log("http://localhost:3005/api/blog/findBlog" + filter);
                console.log(data.data);
                setBlog(data.data);
            });
    }
    const seacrhBlog = event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const filter = "?filter=" + data.get("filter");
        console.log(filter);
        getBlog(filter);
    };

    const Search = styled("form")(({ theme }) => ({
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25)
        },
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(1),
            width: "auto"
        }
    }));

    const SearchIconWrapper = styled("div")(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
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
                    width: "20ch"
                }
            }
        }
    }));

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexWrap:"wrap",
                    m:'5vh 5vw 0vh 5vw'
                }}
            >
                <Typography variant="h4" component="div">
                    Blog
                </Typography>
                {user && (
                    <Button
                        variant="contained"
                        onClick={() => {
                            handleOpen();
                        }}
                    >
                        Napravi Blog
                    </Button>
                )}
                <Search onSubmit={seacrhBlog}>
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
            <BlogGrid blogovi = {blogovi} user ={user} moje= {false}/>
            <Dialog open={open} onClose={handleClose}>
                <BlogForma />
            </Dialog>
        </Box>
    );
};

export default Blog;
