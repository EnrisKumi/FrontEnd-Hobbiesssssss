import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import MoreIcon from "@mui/icons-material/MoreVert";
import { Close, Logout, Settings } from "@mui/icons-material";
import {
  InputAdornment,
  OutlinedInput,
  Popover,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { addUser, getUserFromCognitoId } from "../apiCalls";

import logoHobbytales from "../logos/logoHobbyTales.png";
import userProfileIcon from "../logos/Group 172.png";
import searchIcon from "../logos/Group 173.png";

import backIcon from "../logos/Group 181.png";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import UserSearchModal from "./UserSearchModal";

import { Auth } from "aws-amplify";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  const percentageINeed = 0.5 * width;
  return {
    percentageINeed,
    width,
    height,
  };
}
export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function Navbar({ called, userId }) {
  const { percentageINeed } = useWindowDimensions();

  const [username, setusername] = useState("");
  const theme = useTheme();
  const matchesDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const userContext = useContext(UserContext);
  const { currentUserId } = userContext;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [searchOpen, setsearchOpen] = useState(false);
  const [searchvalue, setsearchvalue] = useState("");
  const [navbarsearch, setnavbarsearch] = useState("");
  const [usersFound, setusersFound] = useState();
  const [modal, setmodal] = useState(false);
  console.log(searchvalue == "");

  const SearchResults = async () => {
    const userAuth = await Auth.currentAuthenticatedUser();
    const token = userAuth.signInUserSession.idToken.jwtToken;
    const requestInfo = {
      headers: {
        Authorization: token,
      },
    };
    const res = await axios.get(
      `https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com/dev/searchParams?searchQuery=${searchvalue}`,
      requestInfo
    );
    const data = res.data;
    setusersFound(data);
  };

  async function handleSignOut() {
    try {
      await Auth.signOut();
      localStorage.setItem("isLogged", false);
      window.location.href = "/";
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  useEffect(() => {
    getUserFromCognitoId(userId).then((data) => setusername(data.username));
  }, [userId]);

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
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleSignOut();
        }}
      >
        Log Out
      </MenuItem>
    </Menu>
  );

  const renderMobileSearchInput = searchOpen ? (
    <OutlinedInput
      sx={{
        padding: 1,
        color: "background.paper",
        backgroundColor: "navbarColor.dark",
        height: "40px",
        width: 1,
      }}
      id="outlined-adornment-weight"
      placeholder="Search"
      value={searchvalue}
      onChange={(e) => setsearchvalue(e.target.value)}
      startAdornment={
        <InputAdornment
          onClick={() => {
            if (searchvalue == "") {
              setsearchvalue("");
            } else {
              setnavbarsearch(searchvalue);
              SearchResults();
              setmodal(true);
            }
          }}
          position="start"
        >
          <img src={searchIcon} height={20} width={20} />
        </InputAdornment>
      }
      endAdornment={
        searchvalue ? (
          <InputAdornment onClick={() => setsearchvalue("")} position="end">
            <IconButton
              sx={{
                backgroundColor: "navbarColor.light",
                "& :hover": {
                  backgroundColor: "navbarColor.light",
                  height: 17,
                  width: 17,
                  borderRadius: "50%",
                },
                height: 20,
                width: 20,
              }}
            >
              <Close sx={{ height: 20, width: 20 }} />
            </IconButton>
          </InputAdornment>
        ) : null
      }
      aria-describedby="outlined-weight-helper-text"
      inputProps={{
        "aria-label": "weight",
      }}
    />
  ) : null;
  const renderDesktopSearchInput = (
    <OutlinedInput
      sx={{
        padding: 1,
        color: "background.paper",
        backgroundColor: "navbarColor.dark",
        height: "40px",
        width: 1,
      }}
      id="outlined-adornment-weight"
      placeholder="Search"
      value={searchvalue}
      onChange={(e) => setsearchvalue(e.target.value)}
      startAdornment={
        <InputAdornment
          sx={{
            "& :hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => {
            if (searchvalue == "") {
              setsearchvalue("");
            } else {
              setnavbarsearch(searchvalue);
              SearchResults();
              setmodal(true);
            }
          }}
          position="start"
        >
          <img src={searchIcon} height={20} width={20} />
        </InputAdornment>
      }
      endAdornment={
        searchvalue ? (
          <InputAdornment onClick={() => setsearchvalue("")} position="end">
            <IconButton
              sx={{
                backgroundColor: "navbarColor.light",
                "& :hover": {
                  backgroundColor: "navbarColor.light",
                  height: 17,
                  width: 17,
                  borderRadius: "50%",
                },
                height: 20,
                width: 20,
              }}
            >
              <Close sx={{ height: 20, width: 20 }} />
            </IconButton>
          </InputAdornment>
        ) : null
      }
      aria-describedby="outlined-weight-helper-text"
      inputProps={{
        "aria-label": "weight",
      }}
    />
  );

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
          <Settings />
        </IconButton>
        <p>Settings</p>
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleSignOut();
          handleProfileMenuOpen();
        }}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Logout />
        </IconButton>
        <p>Log Out</p>
      </MenuItem>
    </Menu>
  );
  const renderMobileNavbar = (
    <>
      <AppBar
        sx={{
          backgroundColor: "navbarColor.main",
          top: 0,
          zIndex: 2,
          width: "100%",
        }}
        position="sticky"
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {searchOpen ? (
            <IconButton
              onClick={() => setsearchOpen(false)}
              to="/mainpage"
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
              sx={{
                color: "white",
                display: { xs: "block", sm: "none" },
                marginRight: 0,
              }}
              size="large"
              color="inherit"
            >
              <img src={logoHobbytales} height={25} width={150} />
            </IconButton>
          )}
          {renderMobileSearchInput}

          {/* <Modal
            sx={{
              position: "absolute",
              top: "64px",
            }}
            open={modal}
          >
            <UserSearchModal usersFound={usersFound} />
          </Modal> */}
          <Popover
            open={modal}
            onClose={() => {
              setsearchvalue("");
              setmodal(false);
            }}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 67, left: 0 }}
            PaperProps={{
              style: { width: "100%" },
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <UserSearchModal usersFound={usersFound} />
          </Popover>

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
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  component={Link}
                  to={`/userprofile/${currentUserId}`}
                  color="inherit"
                  onClick={() => addUser()}
                >
                  <img src={userProfileIcon} height={25} width={25} />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );

  const renderDesktopNavbar = (
    <>
      <Box
        sx={{
          top: 0,
          zIndex: 2,
          width: "100%",
        }}
        position="sticky"
      >
        <AppBar sx={{ backgroundColor: "navbarColor.main" }} position="static">
          <Stack flexDirection="row" justifyContent="space-between">
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                flex: { xl: 2, lg: 1 },
              }}
            ></Box>

            <Box flex={12}>
              <Toolbar
                sx={{ alignItems: "center", justifyContent: "space-around" }}
              >
                <Box
                  flex={1}
                  sx={{
                    display: {
                      xs: "none",
                      sm: "flex",
                      textDecoration: "none",
                    },
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" noWrap color={"inherit"}>
                    <img src={logoHobbytales} height={30} width={175} />
                  </Typography>
                </Box>
                <Box flex={1}>{renderDesktopSearchInput}</Box>
                <Popover
                  open={modal}
                  onClose={() => {
                    setsearchvalue("");
                    setmodal(false);
                  }}
                  anchorReference="anchorPosition"
                  anchorPosition={{ top: 67, left: percentageINeed }}
                  PaperProps={{
                    style: { width: "30%" },
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <UserSearchModal usersFound={usersFound} />
                </Popover>

                <Stack
                  flex={1}
                  width={175}
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    justifyContent: "center",
                  }}
                  flexDirection="row"
                >
                  <IconButton
                    component={Link}
                    to={`/userprofile/${currentUserId}`}
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={() => addUser()}
                    color="inherit"
                  >
                    <img src={userProfileIcon} height={25} width={25} />
                  </IconButton>
                </Stack>
              </Toolbar>
            </Box>
            <Box
              flex={2}
              sx={{
                display: { xs: "none", lg: "flex" },
                flex: { xl: 2, lg: 1 },
              }}
            ></Box>
          </Stack>
        </AppBar>
      </Box>
    </>
  );

  const renderUserProfileNavbar = (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Box flex={12}>
          <AppBar
            sx={{ backgroundColor: "navbarColor.main" }}
            position="static"
          >
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => setsearchOpen(false)}
                  component={Link}
                  to="/mainpage"
                  sx={{
                    display: { xs: "block", sm: "block" },
                    marginRight: 0,
                  }}
                  size="large"
                  color="inherit"
                >
                  <img src={backIcon} height={20} width={20} />
                </IconButton>

                <Typography> {username} </Typography>
                <Box
                  sx={{
                    display: "flex-end",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                ></Box>
              </Box>

              <Box sx={{ display: { xs: "flex", md: "flex" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMenu}
        </Box>
      </Box>
    </>
  );
  const mainNavbar = matchesDesktop ? renderDesktopNavbar : renderMobileNavbar;

  return <> {called == "main" ? mainNavbar : renderUserProfileNavbar} </>;
}

export default React.memo(Navbar);
