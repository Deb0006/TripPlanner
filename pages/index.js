import Head from "next/head";
import { Fragment, useState } from "react";
import { Container, Grid, Typography, Box, Paper } from "@mui/material";
import TripForm from "../components/TripForm";

export default function Home(props) {
  const [title, setTitle] = useState("");
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Fragment>
      <Head>
        <title>TripPlanner - AI-Powered Travel Itinerary Generator</title>
        <meta
          name="description"
          content="Generate personalized travel itineraries with AI"
        />
      </Head>

      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f7fa",
          py: 6,
        }}
      >
        <Container maxWidth="xl">
          {/* Main Content Container */}
          <Grid container spacing={6} alignItems="flex-start">
            {/* Left Content Section */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ pr: { lg: 4 } }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3rem" },
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                    mb: 3,
                  }}
                >
                  Generate a trip itinerary
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "1.3rem",
                    color: "#5a67d8",
                    mb: 2,
                    fontWeight: 500,
                  }}
                >
                  Spend less time planning and more time traveling
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1.1rem",
                    color: "#4a5568",
                    lineHeight: 1.6,
                  }}
                >
                  Simply write a destination, specific place, and choose the type of trip
                  you want.
                </Typography>
              </Box>
            </Grid>

            {/* Right Form Section */}
            <Grid item xs={12} lg={6}>
              <TripForm
                userData={props.user || "null"}
                title={title}
                setTitle={setTitle}
                result={result}
                setResult={setResult}
                message={message}
                setMessage={setMessage}
              />
            </Grid>
          </Grid>

          {/* Preview Area */}
          <Box sx={{ mt: 6 }}>
            <Paper
              elevation={0}
              sx={{
                minHeight: 300,
                border: result ? "2px solid #667eea" : "2px dashed #cbd5e0",
                borderRadius: 2,
                p: 3,
                backgroundColor: "white",
              }}
            >
              {!result && !message && (
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  height: 254
                }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#a0aec0",
                      fontSize: "1.1rem",
                    }}
                  >
                    Your trip itinerary will appear here
                  </Typography>
                </Box>
              )}

              {message && !result && (
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  height: 254
                }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: message.includes("Error") ? "#e53e3e" : "#667eea",
                      fontSize: "1.1rem",
                      textAlign: "center"
                    }}
                  >
                    {message}
                  </Typography>
                </Box>
              )}

              {result && (
                <Box>
                  {title && (
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3,
                        color: "#2d3748",
                        fontWeight: 600,
                        borderBottom: "2px solid #667eea",
                        pb: 2
                      }}
                    >
                      {title}
                    </Typography>
                  )}
                  <Typography 
                    variant="body1"
                    sx={{ 
                      whiteSpace: "pre-line", 
                      lineHeight: 1.8,
                      color: "#4a5568"
                    }}
                  >
                    {result}
                  </Typography>
                  {message && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 2,
                        color: "#38a169",
                        fontStyle: "italic"
                      }}
                    >
                      {message}
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>
          </Box>
        </Container>
      </Box>
    </Fragment>
  );
}
