import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Slider,
  Typography,
  Box,
  Grid
} from '@mui/material';

export default function TripForm(props) {
  const { userData, title, setTitle, result, setResult, message, setMessage } = props;
  const [destination, setDestination] = useState('');
  const [specificPlace, setSpecificPlace] = useState('');
  const [tripType, setTripType] = useState('');
  const [randomness, setRandomness] = useState(3);

  const tripTypes = [
    { value: 'leisure', label: 'Leisure' },
    { value: 'business', label: 'Business' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'family', label: 'Family' }
  ];

  const handleSubmit = async () => {
    if (!destination || !specificPlace || !tripType) {
      setMessage("Please fill in all required fields");
      return;
    }

    setMessage("Generating your trip itinerary...");
    setResult("");

    const response = await fetch('/api/generate-trip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        generatedTrip: {
          destination: destination,
          specificPlace: specificPlace,
          tripType: tripType,
          randomness: randomness,
          model: 'gpt-3.5-turbo'
        },
        uid: userData?.uid || 'Anonymous',
        displayName: userData?.displayName || 'Anonymous',
        email: userData?.email || '',
        photoURL: userData?.photoURL || ''
      })
    });

    const data = await response.json();
    
    if (data.result) {
      setResult(data.result);
      setMessage("Trip itinerary generated successfully!");
      setTitle(`${destination} - ${specificPlace} - ${tripType} Trip`);
    } else {
      setMessage("Error generating trip itinerary. Please try again.");
    }
  };

  return (
    <Card sx={{
      background: 'white',
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e1e8ed'
    }}>
      <CardContent sx={{ p: 4 }}>
        {/* Row 1: Destination and Specific Place */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Destination"
              placeholder="Destination *"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Specific Place"
              placeholder="Specific Place *"
              value={specificPlace}
              onChange={(e) => setSpecificPlace(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />
          </Grid>
        </Grid>
        
        {/* Row 2: Trip Type */}
        <Box sx={{ mb: 3 }}>
          <TextField
            select
            fullWidth
            label="Trip Type"
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          >
            <MenuItem value="">Select Trip Type</MenuItem>
            {tripTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        
        {/* Randomness Slider */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 1 
          }}>
            <Typography variant="body1" sx={{ 
              color: '#4a5568', 
              fontWeight: 500 
            }}>
              Randomness
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }} title="Controls variety in trips and activities suggestions">
              ?
            </Typography>
          </Box>
          <Slider
            value={randomness}
            onChange={(e, newValue) => setRandomness(newValue)}
            min={1}
            max={5}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{
              color: '#667eea',
              '& .MuiSlider-thumb': {
                backgroundColor: '#667eea'
              },
              '& .MuiSlider-track': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }
            }}
          />
        </Box>
        
        {/* Create Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 1.5,
            borderRadius: 1,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            }
          }}
        >
          CREATE →
        </Button>
      </CardContent>
    </Card>
  );
}
