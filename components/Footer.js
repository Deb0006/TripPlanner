import { Box, Typography, Container } from "@mui/material";
import { Fragment } from "react";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <Fragment>
      <footer
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "white",
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          marginTop: "3rem",
        }}
      >
        <Container>
          <Box
            sx={{
              width: 30,
              height: 30,
              background: "linear-gradient(45deg, #ff6b6b, #feca57)",
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              mb: 2,
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            T
          </Box>
          <Typography variant="body1">© 2025 TripPlanner</Typography>
        </Container>
      </footer>
    </Fragment>
  );
}
