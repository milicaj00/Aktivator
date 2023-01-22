import { Button, TextField, Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const RegistracijaForma = () => {
  const registruj = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    await axios
      .post("http://localhost:3005/api/user/addUser", {
        name: data.get("ime"),
        surname: data.get("prezime"),
        email: data.get("email"),
        password: data.get("password"),
      })
      .then((res) => {
        if (res.status === 200) {
          //IDE LOGIN NE ZNAM
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
    console.log(data.get("ime"));
    console.log(data.get("prezime"));
    console.log(data.get("email"));
    console.log(data.get("password"));

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  const notify = () => toast.success("Uspesno ste se registrovali!");
  const notifyError = (text) => toast.error(text);

  return (
    <Box>
      <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        Registrujte se:
      </Typography>
      <Box component="form" onSubmit={registruj}>
        <TextField
          name="ime"
          className="loginInp"
          label="Ime"
          type="text"
          color="primary"
          size="small"
        />
        <TextField
          name="prezime"
          className="loginInp"
          label="Prezime"
          type="text"
          color="primary"
          size="small"
        />
        <TextField
          name="email"
          className="loginInp"
          label="Email"
          type="email"
          color="primary"
          size="small"
        />
        <TextField
          name="lozinka"
          className="loginInp"
          label="Lozinka"
          type="password"
          minlenght="6"
          color="primary"
          size="small"
        />
        <Button size="small" variant="contained" type="submit">
          Registruj se
        </Button>
      </Box>
    </Box>
  );
};
export default RegistracijaForma;
