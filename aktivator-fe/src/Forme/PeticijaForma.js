import { Button, TextField, Box, Typography, Tooltip } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

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
    <Box>
      <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
        Nova Peticija
      </Typography>
      <Box component="form" onSubmit={napraviPeticiju}>
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
          type="file"
          onChange={(event) => {
            setSlika(event.target.files[0]);
          }}
          color="primary"
          size="small"
        />
        <Button size="small" variant="contained" type="submit">
          Dodaj Peticiju
        </Button>
      </Box>
    </Box>
  );
};
export default PeticijaForma;
