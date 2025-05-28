import { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { signInWithGoogle, auth } from "./Login";
import { useAuthState } from "react-firebase-hooks/auth";

const NAV_LINKS = [
  { label: "TRIPS", href: "/user-trips" },
  { label: "EXPLORE", href: "/all-trips" },
  { label: "CREATE", href: "/" },
  { label: "REPORTS", href: "/reports" },
  { label: "ABOUT", href: "/about" },
];

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => setMobileOpen((prev) => !prev);

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            background: "linear-gradient(45deg, #ff6b6b, #feca57)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✈️
        </Box>
        <Typography variant="h6" fontWeight={600}>
          TripPlanner
        </Typography>
      </Box>
      <Divider />
      <List>
        {NAV_LINKS.map(({ label, href }) => (
          <ListItem key={href} disablePadding>
            <Link href={href} passHref legacyBehavior>
              <Button
                component="a"
                sx={{
                  width: "100%",
                  justifyContent: "flex-start",
                  py: 1.5,
                  px: 2,
                  color: "text.primary",
                }}
              >
                <ListItemText primary={label} />
              </Button>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Left section: Logo */}
            <Link href="/" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  ✈️
                </Box>
                <Typography
                  variant="h5"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  TripPlanner
                </Typography>
              </Box>
            </Link>

            {/* Desktop nav links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 3,
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} style={{ textDecoration: "none" }}>
                  <Button
                    sx={{
                      color: "white",
                      fontWeight: 500,
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    {label}
                  </Button>
                </Link>
              ))}
            </Box>

            {/* Mobile hamburger */}
            <IconButton
              sx={{
                display: { xs: "inline-flex", md: "none" },
                color: "white",
              }}
              onClick={toggleDrawer}
              aria-label="open navigation"
            >
              <MenuIcon />
            </IconButton>

            {/* Auth button (always visible) */}
            <Button
              variant="outlined"
              onClick={user ? () => auth.signOut() : signInWithGoogle}
              sx={{
                ml: 2,
                color: "white",
                borderColor: "white",
                fontWeight: 500,
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {user ? "SIGN OUT" : "SIGN IN"}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer for mobile nav */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
