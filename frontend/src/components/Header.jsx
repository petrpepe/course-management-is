import { Link as ReactLink } from "react-router-dom";
import { useSelector } from "react-redux";
import * as React from "react";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function Header({ darkTheme, setDarkTheme }) {
  const { user } = useSelector((state) => state.auth);
  const [drawerState, setDrawerState] = useState({
    management: false,
    main: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerState({ ...drawerState, [anchor]: open });
  };

  const managementListItems = user && user.rolePermissions && (
    <>
      {user.rolePermissions.includes("courseGet") && (
        <ListItem key="courses" disablePadding>
          <ListItemButton
            component={ReactLink}
            to="/courses"
            sx={{ textAlign: "center" }}>
            <ListItemText primary="Courses" />
          </ListItemButton>
        </ListItem>
      )}
      {user.rolePermissions.includes("lessonGet") && (
        <ListItem key="lessons" disablePadding>
          <ListItemButton
            component={ReactLink}
            to="/lessons"
            sx={{ textAlign: "center" }}>
            <ListItemText primary="Lessons" />
          </ListItemButton>
        </ListItem>
      )}
      {user.rolePermissions.includes("userGet") && (
        <ListItem key="users" disablePadding>
          <ListItemButton
            component={ReactLink}
            to="/users"
            sx={{ textAlign: "center" }}>
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>
      )}
      {user.rolePermissions.includes("rolesManagement") && (
        <ListItem key="roles" disablePadding>
          <ListItemButton
            component={ReactLink}
            to="/roles"
            sx={{ textAlign: "center" }}>
            <ListItemText primary="Roles" />
          </ListItemButton>
        </ListItem>
      )}
      {user.rolePermissions.includes("permissionsManagement") && (
        <ListItem key="permissions" disablePadding>
          <ListItemButton
            component={ReactLink}
            to="/permissions"
            sx={{ textAlign: "center" }}>
            <ListItemText primary="Permissions" />
          </ListItemButton>
        </ListItem>
      )}
      {user.rolePermissions.includes("sendEmails") && (
        <ListItem key="email" disablePadding>
          <ListItemButton
            component={ReactLink}
            to="/email"
            sx={{ textAlign: "center" }}>
            <ListItemText primary="Email" />
          </ListItemButton>
        </ListItem>
      )}
      {!drawerState["main"] && (
        <>
          <Divider />
          <ListItem key="logout" disablePadding>
            <ListItemButton
              component={ReactLink}
              to="/logout"
              sx={{ textAlign: "center" }}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </>
  );

  const mainDrawer = (
    <Box
      onClick={toggleDrawer("main", false)}
      onKeyDown={toggleDrawer("main", false)}
      sx={{ textAlign: "center", minWidth: "200px" }}>
      <List>
        {user && user.rolePermissions && (
          <>
            {user.rolePermissions.includes("classGet") && (
              <ListItem key="classes" disablePadding>
                <ListItemButton
                  component={ReactLink}
                  to="/classes"
                  sx={{ textAlign: "center" }}>
                  <ListItemText primary="Classes" />
                </ListItemButton>
              </ListItem>
            )}
            {user.rolePermissions.includes("timetablesGet") && (
              <ListItem key="timetable" disablePadding>
                <ListItemButton
                  component={ReactLink}
                  to="/timetable"
                  sx={{ textAlign: "center" }}>
                  <ListItemText primary="Timetable" />
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}
        <Divider />
        {user && user.rolePermissions && managementListItems}
        <Divider />
        <ListItem key="profile" disablePadding>
          <ListItemButton
            component={ReactLink}
            to="/me"
            sx={{ textAlign: "center" }}>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        <ListItem key="logout" disablePadding>
          <ListItemButton
            component={ReactLink}
            to="/logout"
            sx={{ textAlign: "center" }}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const managementDrawer = (
    <Box
      onClick={toggleDrawer("management", false)}
      onKeyDown={toggleDrawer("management", false)}
      sx={{ textAlign: "center", minWidth: "200px" }}>
      <List>{managementListItems}</List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar sx={{ py: 1, px: 3 }}>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              flexGrow: { xs: 1, sm: "unset" },
              textAlign: "left",
              mr: 2,
            }}>
            <Link component={ReactLink} to={user && "/"} sx={{ color: "#fff" }}>
              System
            </Link>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "flex-start",
              display: { xs: "none", sm: "flex" },
            }}>
            {user &&
              user.rolePermissions &&
              user.rolePermissions.includes("classGet") && (
                <Button
                  component={ReactLink}
                  to="/classes"
                  sx={{ color: "#fff" }}>
                  Classes
                </Button>
              )}
            {user &&
              user.rolePermissions &&
              user.rolePermissions.includes("timetablesGet") && (
                <Button
                  component={ReactLink}
                  to="/timetable"
                  sx={{ color: "#fff" }}>
                  Timetable
                </Button>
              )}
          </Box>
          {darkTheme ? (
            <IconButton size="large" onClick={() => setDarkTheme(!darkTheme)}>
              <LightModeIcon />
            </IconButton>
          ) : (
            <IconButton size="large" onClick={() => setDarkTheme(!darkTheme)}>
              <DarkModeIcon sx={{ color: "#fff" }} />
            </IconButton>
          )}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {!user ? (
              <Button component={ReactLink} to="/login" sx={{ color: "#fff" }}>
                Login
              </Button>
            ) : (
              <Button component={ReactLink} to="/me" sx={{ color: "#fff" }}>
                Profile
              </Button>
            )}
          </Box>
          {user && user.rolePermissions && (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  ml: 2,
                  alignItems: "center",
                }}
                onClick={toggleDrawer(
                  "management",
                  !drawerState["management"]
                )}>
                <MenuIcon />
              </IconButton>
              <SwipeableDrawer
                anchor={"right"}
                open={drawerState["management"]}
                onClose={toggleDrawer("management", false)}
                onOpen={toggleDrawer("management", true)}>
                {managementDrawer}
              </SwipeableDrawer>
            </>
          )}
          {user ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{
                  display: { xs: "flex", sm: "none" },
                  ml: 2,
                  alignItems: "center",
                }}
                onClick={toggleDrawer("main", !drawerState["main"])}>
                <MenuIcon />
              </IconButton>
              <SwipeableDrawer
                anchor={"right"}
                open={drawerState["main"]}
                onClose={toggleDrawer("main", false)}
                onOpen={toggleDrawer("main", true)}>
                {mainDrawer}
              </SwipeableDrawer>
            </>
          ) : (
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <Button component={ReactLink} to="/login" sx={{ color: "#fff" }}>
                Login
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}

export default Header;
