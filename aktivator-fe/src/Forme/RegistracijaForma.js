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
        password: data.get("lozinka"),
      })
      .then((res) => {
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
        } else {
          notifyError("Doslo je do greske!");
        }
      });
  };
  const notify = () => toast.success("Uspesno ste se registrovali!");
  const notifyError = (text) => toast.error(text);

  return (
    <Box
      className="cardCenter"
      sx={{ gap: "1vh", padding: { sm: "10% 10%" }, alignItems: "stretch" }}
    >
      <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        Registracija
      </Typography>
      <Box sx={{ padding: "0% 20%" }} component="form" onSubmit={registruj}>
        <TextField
          sx={{ width: "100%", mb: "1vh" }}
          name="ime"
          label="Ime"
          type="text"
          color="primary"
          size="small"
        />
        <TextField
          sx={{ width: "100%", mb: "1vh" }}
          name="prezime"
          label="Prezime"
          type="text"
          color="primary"
          size="small"
        />
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
          name="lozinka"
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
          Registruj se
        </Button>
      </Box>
    </Box>
  );
};
export default RegistracijaForma;
