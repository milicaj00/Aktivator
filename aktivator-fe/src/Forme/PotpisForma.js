import { Button, TextField, Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const PotpisForma = ({ naslov }) => {
  const login = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(
      { naslov },
      data.get("user_name"),
      data.get("user_surname"),
      data.get("user_email")
    );
    await axios
      .put("http://localhost:3005/api/peticija/addSignature", {
        user_name: data.get("user_name"),
        user_surname: data.get("user_surname"),
        user_email: data.get("user_email"),
        naslov: naslov,
      })
      .then((res) => {
        console.log({ res });
        if (res.status === 200) {
          //IDE LOGIN NE ZNAM
          console.log("DOBROJE");
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
          console.log(error.response);
          notifyError("Doslo je do greske!");
        }
      });
  };
  const notify = () => toast.success("Uspesno ste potpisali peticiju!");
  const notifyError = (text) => toast.error(text);

  return (
    <Box
      className="cardCenter"
      sx={{ gap: "1vh", padding: { sm: "10% 10%" }, alignItems: "stretch" }}
    >
      <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        Potpisi
      </Typography>
      <Box sx={{ padding: "0% 20%" }} component="form" onSubmit={login}>
        <TextField
          name="user_name"
          sx={{ width: "100%", mb: "1vh" }}
          label="Ime"
          type="text"
          color="primary"
          size="small"
        />
        <TextField
          name="user_surname"
          sx={{ width: "100%", mb: "1vh" }}
          label="Prezime"
          type="text"
          color="primary"
          size="small"
        />
        <TextField
          name="user_email"
          sx={{ width: "100%", mb: "1vh" }}
          label="Email"
          type="email"
          color="primary"
          size="small"
        />
        <Button
          sx={{ width: "100%", mb: "1vh" }}
          size="small"
          variant="contained"
          type="submit"
        >
          Potpisi
        </Button>
      </Box>
    </Box>
  );
};
export default PotpisForma;
