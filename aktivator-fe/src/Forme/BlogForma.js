import { Button, TextField, Box, Typography, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

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
    <Box>
      <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        Novi Blog
      </Typography>
      <Box component="form" onSubmit={napraviBlog}>
        <TextField
          name="naslov"
          className="loginInp"
          label="Naslov"
          type="text"
          color="primary"
          size="small"
        />
        <TextField
          name="text"
          className="prelomi"
          label="Tekst"
          type="text"
          color="primary"
          size="small"
          multiline
          rows={10}
        />
        <Tooltip
          disableFocusListener
          placement="bottom"
          title="Tagove odvojiti , bez razmaka"
        >
          <TextField
            name="tag"
            className="loginInp"
            label="Tagovi"
            type="text"
            color="primary"
            size="small"
          />
        </Tooltip>
        <TextField
          className="loginInp"
          onChange={(event) => {
            setSlika(event.target.files[0]);
          }}
          type="file"
          color="primary"
          size="small"
        />
        <Button size="small" variant="contained" type="submit">
          Dodaj Blog
        </Button>
      </Box>
    </Box>
  );
};
export default BlogForma;
