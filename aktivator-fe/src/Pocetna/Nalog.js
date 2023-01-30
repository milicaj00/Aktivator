import {
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getMojePeticije, getMojiBlogovi, getSubs,deleteTag } from "../api";
import PeticijaForma from "../Forme/PeticijaForma";
import { BlogGrid } from "../Komponente/BlogGrid";
import { PeticijaGrid } from "../Komponente/PeticijaGrid";
import BlogForma from "../Forme/BlogForma";
import DeleteIcon from "@mui/icons-material/Delete";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
};

const Nalog = () => {
  const [user, setUser] = useState(null);
  const [mojiTagovi, SetTagovi] = useState([]);
  const [mojiBlogovi, SetMojiBlogovi] = useState([]);
  const [mojePeticije, SetMojePeticije] = useState([]);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    getMojiBlogovi(SetMojiBlogovi);
    getMojePeticije(SetMojePeticije);
    getSubs(u.id, SetTagovi);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Moje Peticije"></Tab>
        <Tab label="Moji Blogovi"></Tab>
        <Tab label="Moji Tagovi"></Tab>
      </Tabs>
      <TabPanel value={value} index={0}>
        <Box sx={{ m: "0% 5%" }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              handleOpen();
            }}
          >
            Napravi novu peticiju
          </Button>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <PeticijaForma />
        </Dialog>
        {mojePeticije && (
          <PeticijaGrid
            sPeticije={SetMojePeticije}
            peticije={mojePeticije}
            user={user}
            moje={true}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ m: "0% 5%" }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              handleOpen();
            }}
          >
            Napravi novi blog
          </Button>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <BlogForma />
        </Dialog>
        {mojiBlogovi && (
          <BlogGrid
            sBlogovi={SetMojiBlogovi}
            blogovi={mojiBlogovi}
            user={user}
            moje={true}
          ></BlogGrid>
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {user && mojiTagovi?.map((t, i) => (
          <>
            <List>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick = {async () =>{ await deleteTag(t, user.id); await getSubs(user.id, SetTagovi);}}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={t} />
              </ListItem>
            </List>
            {i !== mojiTagovi.length - 1 && <Divider />}
          </>
        ))}
      </TabPanel>
    </Box>
  );
};

export default Nalog;
