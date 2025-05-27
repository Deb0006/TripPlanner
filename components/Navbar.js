import Link from "next/link";
import { signInWithGoogle, auth } from "./Login";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Container,
} from "@mui/material";

export default function Navbar() {
  const [user] = useAuthState(auth);

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Logo Section */}
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
                sx={{
                  color: "white",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                TripPlanner
              </Typography>
            </Box>
          </Link>

          {/* Navigation Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <Link href="/user-trips" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  color: "white",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                TRIPS
              </Button>
            </Link>
            <Link href="/all-trips" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  color: "white",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                EXPLORE
              </Button>
            </Link>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  color: "white",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                CREATE
              </Button>
            </Link>
            <Link href="/reports" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  color: "white",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                REPORTS
              </Button>
            </Link>
            <Link href="/about" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  color: "white",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                ABOUT
              </Button>
            </Link>
          </Box>

          {/* Auth Button */}
          <Button
            variant="outlined"
            onClick={user ? () => auth.signOut() : signInWithGoogle}
            sx={{
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
  );
}