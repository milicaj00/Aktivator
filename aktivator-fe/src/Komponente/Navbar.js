import * as React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const pages = [
  { val: "Peticije", link: "/peticija" },
  { val: "Blog", link: "/blog" },
];
const settings = ["Profil", "Logout"];

function Navbar({ user }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
    
  // const [user, setUser] = React.useState(null);
  // React.useEffect(() => {
  //   const u = JSON.parse(localStorage.getItem("user"));
  //   setUser(u);
  // }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  let navigate = useNavigate();

  const handleCloseUserMenu = (setting) => {
    console.log(setting);
    if (setting === "Profil") {
      navigate("../nalog", { replace: true });
    }
    if (setting === "Logout") {
      localStorage.clear();
      navigate("../");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="secondary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* veliki */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            AKTIVATOR
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page, i) => (
                <NavLink to={page.link} key={page.val}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.val}</Typography>
                  </MenuItem>
                </NavLink>
              ))}
            </Menu>
          </Box>

          {/* mobilni meni */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            AKTIVATOR
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.val}
                href={page.link}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.val}
              </Button>
            ))}
          </Box>
          {/* mobilni desno kad korisnik nije ulogovan */}
          {!user && (
            <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
              <Tooltip title="Login">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, color: "white" }}
                >
                  <LoginIcon />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-login"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <NavLink to="/login">
                  <MenuItem key="Log in" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center"> Prijavi se</Typography>
                  </MenuItem>
                </NavLink>
                <NavLink to="/signup">
                  <MenuItem key="Sign up" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center"> Registruj se</Typography>
                  </MenuItem>
                </NavLink>
              </Menu>
            </Box>
          )}

          <Box sx={{ flexGrow: 0 }}>
            {!user && (
              <Button
                variant="contained"
                href="/login"
                sx={{ color: "white", display: { xs: "none", md: "inline" } }}
              >
                Prijavi se
              </Button>
            )}

            {!user && (
              <Button
                variant="contained"
                href="/signup"
                sx={{
                  m: 1,
                  color: "white",
                  display: { xs: "none", md: "inline" },
                }}
              >
                Registruj se
              </Button>
            )}
            {user && (
              <Box display="inline-flex">
                <Tooltip title="Account">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0, color: "white" }}
                  >
                    <AccountCircleOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            {user && (
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu(setting);
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
