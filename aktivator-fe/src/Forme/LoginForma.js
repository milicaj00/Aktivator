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
          notifyError(error.response.data.message);
          console.log(error.response.data.message);
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
    <Box
      className="cardCenter"
      sx={{ gap: "1vh", padding: { sm: "10% 10%" }, alignItems: "stretch" }}
    >
      <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        Prijava
      </Typography>
      <Box sx = {{padding:"0% 20%" }} component="form" onSubmit={login}>
        <TextField
          sx={{ width: "100%", mb: "1vh" }}
          name="email"
          label="Email"
          type="email"
          color="primary"
          size="small"
        />
        <TextField
          sx={{ width: "100%", mb: "1vh" }}
          name="password"
          label="Lozinka"
          type="password"
          minlenght="6"
          color="primary"
          size="small"
        />
        <Button
          sx={{ width: "100%", mb: "1vh" }}
          size="small"
          variant="contained"
          type="submit"
        >
          Prijavi se
        </Button>
      </Box>
    </Box>
  );
};
export default LoginForma;
