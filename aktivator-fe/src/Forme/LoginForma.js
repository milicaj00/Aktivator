import { Button, TextField, Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const LoginForma = () => {
  const login = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log(data.get("email"), data.get("password"));
    await axios
      .post("http://localhost:3005/api/user/login", {
        email: data.get("email"),
        password: data.get("password"),
      })
      .then((res) => {
        console.log(res.data.data);
        if (res.status === 200) {
          //IDE LOGIN NE ZNAM
          localStorage.setItem("user", JSON.stringify(res.data.data));
          notify();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
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

    console.log(data.get("email"));
    console.log(data.get("password"));
  };
  const notify = () => toast.success("Uspesno ste se ulogovali!");
  const notifyError = (text) => toast.error(text);

  return (
    <Box>
      <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        Uloguj se:
      </Typography>
      <Box component="form" onSubmit={login}>
        <TextField
          name="email"
          className="loginInp"
          label="Email"
          type="email"
          color="primary"
          size="small"
        />
        <TextField
          name="password"
          className="loginInp"
          label="Lozinka"
          type="password"
          minlenght="6"
          color="primary"
          size="small"
        />
        <Button size="small" variant="contained" type="submit">
          Uloguj se
        </Button>
      </Box>
    </Box>
  );
};
export default LoginForma;
