import {
  Button,
  TextField,
  Box,
  Badge,
  IconButton,
  Tooltip,Typography
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import HelpIcon from "@mui/icons-material/Help";

const BlogForma = () => {
  const [slika, setSlika] = useState("");

  const napraviBlog = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.append("slika", slika);
    data.append("user_email", JSON.parse(localStorage.getItem("user")).email);

    console.log(data.get("slika"));

    await axios
      .post("http://localhost:3005/api/blog/addBlog", data)
      .then((res) => {
        if (res.status === 200) {
          notify();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      })
      .catch((error) => {
        if (error.response.status === 406) {
          notifyError(error.response.data.message);
          console.log(error.response.data.message);
        } else {
          console.log(error);
          notifyError("Doslo je do greske!");
        }
      });
  };
  const notify = () => toast.success("Uspesno ste dodali blog!");
  const notifyError = (text) => toast.error(text);

  return (
    <Box
      className="cardCenter"
      sx={{ gap: "1vh", padding: { sm: "10% 10%" }, alignItems: "stretch" }}
    >
      <Typography className="cardCenter" variant="h4">
        Novi Blog
      </Typography>
      <Box component="form" onSubmit={napraviBlog}>
        <TextField
          sx={{ width: "100%", mb: "1vh" }}
          name="naslov"
          label="Naslov"
          type="text"
          color="primary"
          size="small"
        />
        <TextField
          sx={{ width: "100%", mb: "1vh" }}
          name="text"
          label="Tekst"
          type="text"
          color="primary"
          size="small"
          multiline
          rows={10}
        />
        <Badge
          sx={{ width: "100%", mb: "1vh" }}
          badgeContent={
            <IconButton>
              <HelpIcon color="secondary"> </HelpIcon>
            </IconButton>
          }
        >
          <Tooltip
            placement="right-start"
            title="Tagove odvojiti zapetom ( , ) bez razmaka!"
          >
            <TextField
              fullWidth
              name="tag"
              className="loginInp"
              label="Tagovi"
              type="text"
              color="primary"
              size="small"
            />
          </Tooltip>
        </Badge>
        <TextField
          sx={{ width: "100%", mb: "1vh" }}
          onChange={(event) => {
            setSlika(event.target.files[0]);
          }}
          type="file"
          color="primary"
          size="small"
        />
        <Button
          sx={{ width: "100%", mb: "1vh" }}
          size="small"
          variant="contained"
          type="submit"
        >
          Dodaj Blog
        </Button>
      </Box>
    </Box>
  );
};
export default BlogForma;
