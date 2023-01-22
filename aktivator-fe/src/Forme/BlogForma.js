import { Button, TextField, Box, Typography, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const BlogForma = () => {
  const napraviBlog = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    await axios
      .post("http://localhost:3005/api/blog/addBlog", {
        naslov: data.get("naslov"),
        text: data.get("text"),
        tag: data.get("tag"),
        user_email: JSON.parse(window.localStorage.getItem("user")).email,
      })
      .then((res) => {
        if (res.status === 200) {
          notify();
        }
      })
      .catch((error) => {
        if (error.response.status === 406) {
          notifyError(error.response.message);
          console.log(error.response.message);
        } else {
          notifyError("Doslo je do greske!");
        }
      });

    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
          name="Tekst"
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
          name="slika"
          className="loginInp"
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
