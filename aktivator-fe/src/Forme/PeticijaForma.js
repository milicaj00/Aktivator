import {
  Button,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Badge,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import HelpIcon from "@mui/icons-material/Help";

const PeticijaForma = () => {
  const [slika, setSlika] = useState("");
  const napraviPeticiju = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    data.append("slika", slika);
    data.append("user_email", JSON.parse(localStorage.getItem("user")).email);

    await axios
      .post("http://localhost:3005/api/peticija/addPeticija", data)
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          notify();
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
  };
  const notify = () => toast.success("Uspesno ste dodali peticiju!");
  const notifyError = (text) => toast.error(text);

  return (
    <Box
      className="cardCenter"
      sx={{ gap: "1vh", margin: "10%", alignItems: "stretch" }}
    >
      <Typography className="cardCenter" variant="h4">
        Nova Peticija
      </Typography>
      <Box component="form" onSubmit={napraviPeticiju}>
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
          badgeContent={<HelpIcon color="secondary"></HelpIcon>}
        >
          <Tooltip
            placement="right-start"
            title="Tagove odvojiti zapetom ( , ) bez razmaka!"
          >
            <TextField
              fullWidth
              name="tag"
              label="Tagovi"
              type="text"
              color="primary"
              size="small"
            />
          </Tooltip>
        </Badge>
        <TextField
          sx={{ width: "100%", mb: "1vh" }}
          type="file"
          onChange={(event) => {
            setSlika(event.target.files[0]);
          }}
          color="primary"
          size="small"
        />
        <Button
          sx={{ width: "100%", mb: "1vh" }}
          size="small"
          variant="contained"
          type="submit"
        >
          Dodaj Peticiju
        </Button>
      </Box>
    </Box>
  );
};
export default PeticijaForma;
