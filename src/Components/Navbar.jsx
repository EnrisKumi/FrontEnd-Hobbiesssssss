import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Home } from "@mui/icons-material";
import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { addUser } from "../apiCalls";
import group169 from "../logos/Group 169.png";
import userProfileIcon from "../logos/Group 172.png";
import searchIcon from "../logos/Group 173.png";
import xIcon from "../logos/Group 182.png";
import backIcon from "../logos/Group 181.png";
import { useState } from "react";

async function signOut() {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log("error signing out: ", error);
  }
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  flex: 3,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "100%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
}));

function Navbar({ called }) {
  const theme = useTheme();
  const matchesDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const userContext = useContext(UserContext);
  const { currentUserId } = userContext;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [searchOpen, setsearchOpen] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";

  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMobileSearchInput = searchOpen ? (
    <OutlinedInput
      sx={{ backgroundColor: "gray", height: "40px" }}
      id="outlined-adornment-weight"
      placeholder="Search"
      value=""
      startAdornment={
        <InputAdornment position="start">
          <img src={searchIcon} height={20} width={20} />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment onClick={() => setsearchOpen(false)} position="end">
          <img src={xIcon} height={20} width={20} />
        </InputAdornment>
      }
      aria-describedby="outlined-weight-helper-text"
      inputProps={{
        "aria-label": "weight",
      }}
    />
  ) : null;

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>

      <MenuItem
        component={Link}
        to="/UserProfile"
        onClick={handleProfileMenuOpen}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  const renderMobileNavbar = (
    <>
      <Box sx={{ top: 0, zIndex: 2, width: "100%" }} position="sticky">
        <AppBar position="static">
          <Stack flexDirection="row" justifyContent="space-between">
            <Box flex={2} sx={{ display: { xs: "none", md: "flex" } }}></Box>

            <Box flex={12}>
              <Toolbar sx={{ justifyContent: "space-around" }}>
                {searchOpen ? (
                  <IconButton
                    onClick={() => setsearchOpen(false)}
                    to="/"
                    sx={{
                      display: { xs: "block", sm: "none" },
                      marginRight: 0,
                    }}
                    size="large"
                    color="inherit"
                  >
                    <img src={backIcon} height={25} width={25} />
                  </IconButton>
                ) : (
                  <IconButton
                    component={Link}
                    to="/"
                    sx={{
                      display: { xs: "block", sm: "none" },
                      marginRight: 0,
                    }}
                    size="large"
                    color="inherit"
                  >
                    <img src={group169} height={25} width={75} />
                  </IconButton>
                )}
                <Box>{renderMobileSearchInput}</Box>

                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    alignItems: "center",
                    marginLeft: { sm: 2 },
                  }}
                >
                  {searchOpen ? null : (
                    <>
                      <IconButton
                        size="large"
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={() => setsearchOpen(true)}
                        color="inherit"
                      >
                        <img src={searchIcon} height={20} width={20} />
                      </IconButton>
                      <img src={userProfileIcon} height={25} width={25} />
                    </>
                  )}
                </Box>
              </Toolbar>
            </Box>
            <Box flex={2} sx={{ display: { xs: "none", md: "flex" } }}></Box>
          </Stack>
        </AppBar>
        {renderMobileMenu}
      </Box>
    </>
  );

  const renderDesktopNavbar = (
    <>
      <Box sx={{ top: 0, zIndex: 2, width: "100%" }} position="sticky">
        <AppBar position="static">
          <Stack flexDirection="row" justifyContent="space-between">
            <Box flex={2} sx={{ display: { xs: "none", sm: "flex" } }}></Box>

            <Box flex={12}>
              <Toolbar sx={{ justifyContent: "space-around" }}>
                <Box
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                      textDecoration: "none",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    to="/"
                    color={"inherit"}
                  >
                    SPORT
                  </Typography>
                </Box>

                <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                  <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                  >
                    <Badge badgeContent={4} color="error">
                      <MailIcon />
                    </Badge>
                  </IconButton>

                  <IconButton
                    component={Link}
                    to={`/UserProfile/${currentUserId}`}
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={addUser()}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <LogoutIcon
                    onClick={signOut}
                    style={{ float: "right", margin: "10px" }}
                  ></LogoutIcon>
                </Box>
              </Toolbar>
            </Box>
            <Box flex={2} sx={{ display: { xs: "none", sm: "flex" } }}></Box>
          </Stack>
        </AppBar>
      </Box>
    </>
  );

  const renderUserProfileNavbar = (
    <>
      <Box sx={{ top: 0, zIndex: 2, width: "100%" }} position="sticky">
        <AppBar position="static">
          <Stack flexDirection="row" justifyContent="space-between">
            <Box flex={2} sx={{ display: { xs: "none", md: "flex" } }}></Box>

            <Box flex={12}>
              <Toolbar sx={{ justifyContent: "space-between" }}>
                <IconButton
                  onClick={() => setsearchOpen(false)}
                  to="/"
                  sx={{
                    display: { xs: "block", sm: "none" },
                    marginRight: 0,
                  }}
                  size="large"
                  color="inherit"
                >
                  <img src={backIcon} height={25} width={25} />
                </IconButton>

                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    alignItems: "center",
                    marginLeft: { sm: 2 },
                  }}
                ></Box>
              </Toolbar>
            </Box>
            <Box flex={2} sx={{ display: { xs: "none", md: "flex" } }}></Box>
          </Stack>
        </AppBar>
        {renderMobileMenu}
      </Box>
    </>
  );
  const mainNavbar = matchesDesktop ? renderDesktopNavbar : renderMobileNavbar;

  return <> {called == "main" ? mainNavbar : renderUserProfileNavbar} </>;
}

export default React.memo(Navbar);
