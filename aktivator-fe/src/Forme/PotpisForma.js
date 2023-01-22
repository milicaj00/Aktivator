import { Button, TextField, Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const PotpisForma = ({ naslov }) => {
  const login = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.append("naslov", naslov);

    console.log(data.get("email"), data.get("password"));
    await axios
      .post("http://localhost:3005/api/peticija/addSignature", data)
      .then((res) => {
        console.log({ res });
        if (res.status === 200) {
          //IDE LOGIN NE ZNAM
          console.log("DOBROJE");
          notify();
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
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
  };
  const notify = () => toast.success("Uspesno ste potpisali peticiju!");
  const notifyError = (text) => toast.error(text);

  return (
    <Box>
      <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        Potpisi
      </Typography>
      <Box component="form" onSubmit={login}>
        <TextField
          name="user_name"
          className="loginInp"
          label="Ime"
          type="text"
          color="primary"
          size="small"
        />
        <TextField
          name="user_surname"
          className="loginInp"
          label="Prezime"
          type="text"
          color="primary"
          size="small"
        />
        <TextField
          name="user_email"
          className="loginInp"
          label="Email"
          type="email"
          color="primary"
          size="small"
        />
        <Button size="small" variant="contained" type="submit">
          Potpisi
        </Button>
      </Box>
    </Box>
  );
};
export default PotpisForma;
