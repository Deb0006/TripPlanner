import { Fragment, useState, useEffect } from "react";
import { 
 Typography, 
 Card, 
 TableContainer, 
 Table, 
 TableHead, 
 TableBody, 
 TableRow, 
 TableCell, 
 Paper, 
 Select, 
 MenuItem, 
 FormControl, 
 InputLabel,
 TextField,
 Grid,
 Box,
 IconButton,
 Tooltip,
 Dialog,
 DialogTitle,
 DialogContent,
 DialogActions,
 Button 
} from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

function Reports(props) {
 const [trips, setTrips] = useState();
 const [isLoading, setIsLoading] = useState(false);
 const [reportType, setReportType] = useState('date');
 const [startDate, setStartDate] = useState('');
 const [endDate, setEndDate] = useState('');
 const [destination, setDestination] = useState('all');
 const [selectedTrip, setSelectedTrip] = useState(null);
 const [viewModalOpen, setViewModalOpen] = useState(false);
 const [editModalOpen, setEditModalOpen] = useState(false);
 const [deleteModalOpen, setDeleteModalOpen] = useState(false);
 const [editedTitle, setEditedTitle] = useState('');
 const [isUpdating, setIsUpdating] = useState(false);

 const handleViewTrip = (trip) => {
   setSelectedTrip(trip);
   setViewModalOpen(true);
 };

 const handleCopyTrip = (trip) => {
   const content = trip.generatedLesson || trip.generatedTrip;
   navigator.clipboard.writeText(content);
 };

 const handleEditTrip = (trip) => {
   setSelectedTrip(trip);
   setEditedTitle(trip.lessonTitle || trip.tripTitle);
   setEditModalOpen(true);
 };

 const handleDeleteTrip = (trip) => {
   setSelectedTrip(trip);
   setDeleteModalOpen(true);
 };

 const confirmEdit = async () => {
   setIsUpdating(true);
   try {
     const response = await fetch('/api/firebase-config', {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         originalLesson: selectedTrip,
         newTitle: editedTitle
       })
     });

     if (!response.ok) {
       throw new Error('Failed to update trip');
     }

     // Refresh the data
     const refreshResponse = await fetch("/api/firebase-config");
     const refreshData = await refreshResponse.json();
     setTrips(refreshData);
     
     setEditModalOpen(false);
     setSelectedTrip(null);
   } catch (error) {
     console.error("Error updating trip:", error);
   } finally {
     setIsUpdating(false);
   }
 };

 const confirmDelete = async () => {
   setIsUpdating(true);
   try {
     const response = await fetch('/api/firebase-config', {
       method: 'DELETE',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         lessonToDelete: selectedTrip
       })
     });

     if (!response.ok) {
       throw new Error('Failed to delete trip');
     }

     // Refresh the data
     const refreshResponse = await fetch("/api/firebase-config");
     const refreshData = await refreshResponse.json();
     setTrips(refreshData);
     
     setDeleteModalOpen(false);
     setSelectedTrip(null);
   } catch (error) {
     console.error("Error deleting trip:", error);
   } finally {
     setIsUpdating(false);
   }
 };

 useEffect(() => {
   async function getTrips() {
     const response = await fetch("/api/firebase-config");
     const data = await response.json();
     console.log("Fetched data:", data); // Debug log
     setTrips(data);
     setIsLoading(true);
   }
   getTrips();
 }, []);

 const handleReportTypeChange = (e) => {
   const newType = e.target.value;
   setReportType(newType);
   setStartDate('');
   setEndDate('');
   setDestination('all');
 };

 const formatDateForDisplay = (date) => {
   return new Date(date).toLocaleDateString('en-US', {
     month: 'short',
     day: 'numeric',
     year: 'numeric'
   });
 };

 const getFilteredTrips = () => {
   if (!trips?.generatedLessons) return [];
   
   let filtered = trips.generatedLessons;
   console.log("Initial trips:", filtered);
   console.log("Number of initial trips:", filtered.length);

   // Show all available dates for debugging
   if (filtered.length > 0) {
     console.log("Available trip dates:", filtered.map(trip => {
       const date = new Date(trip.timestamp.seconds * 1000);
       return {
         title: trip.lessonTitle || trip.tripTitle,
         date: date.toISOString().split('T')[0], // YYYY-MM-DD format
         formatted: date.toLocaleDateString('en-US')
       };
     }));
   }

   if (reportType === 'date' && startDate && endDate) {
     console.log("Filtering by date range:", startDate, "to", endDate);
     
     filtered = filtered.filter(trip => {
       // Convert trip timestamp to Date
       const tripDate = new Date(trip.timestamp.seconds * 1000);
       
       // Convert to YYYY-MM-DD format for comparison
       const tripDateStr = tripDate.toISOString().split('T')[0];
       
       console.log('Checking trip:', trip.lessonTitle || trip.tripTitle, 'Date:', tripDateStr);
       console.log('Date range:', startDate, 'to', endDate);
       
       // Simple string comparison should work for YYYY-MM-DD format
       const isInRange = tripDateStr >= startDate && tripDateStr <= endDate;
       console.log('Is in range:', isInRange);

       return isInRange;
     });
     
     console.log("Filtered trips after date filter:", filtered.length);
   }

   if (reportType === 'destination' && destination !== 'all') {
     filtered = filtered.filter(trip => (trip.subject || trip.destination) === destination);
   }

   return filtered;
 };

 const formatDateInput = (dateStr) => {
   const [year, month, day] = dateStr.split('-');
   return `${day}/${month}/${year}`;
 };

 const getUniqueDestinations = () => {
   if (!trips?.generatedLessons) return [];
   return [...new Set(trips.generatedLessons.map(trip => trip.subject || trip.destination))];
 };

 const getReportStatistics = (filteredTrips) => {
   if (!filteredTrips.length) return null;

   console.log("Calculating statistics for:", filteredTrips); // Debug log

   const statistics = {
     totalTrips: filteredTrips.length,
     destinationBreakdown: {},
     specificPlaceBreakdown: {},
     dateRange: {
       earliest: new Date(Math.min(...filteredTrips.map(t => t.timestamp.seconds * 1000))),
       latest: new Date(Math.max(...filteredTrips.map(t => t.timestamp.seconds * 1000)))
     }
   };

   // Calculate destination and days breakdowns
   filteredTrips.forEach(trip => {
     // Destination breakdown
     const tripDestination = trip.subject || trip.destination;
     statistics.destinationBreakdown[tripDestination] = (statistics.destinationBreakdown[tripDestination] || 0) + 1;
     
     // Specific Place breakdown
     const tripSpecificPlace = trip.grade || trip.specificPlace;
     statistics.specificPlaceBreakdown[tripSpecificPlace] = (statistics.specificPlaceBreakdown[tripSpecificPlace] || 0) + 1;
   });

   // Calculate most common destination
   const destinations = Object.entries(statistics.destinationBreakdown);
   if (destinations.length > 0) {
     const mostCommonDestination = destinations.sort(([,a], [,b]) => b - a)[0];
     statistics.mostCommonDestination = {
       name: mostCommonDestination[0],
       count: mostCommonDestination[1]
     };
   }

   console.log("Calculated statistics:", statistics); // Debug log
   return statistics;
 };

 const filteredTrips = getFilteredTrips();
 const statistics = getReportStatistics(filteredTrips);

 return (
   <Fragment>
     <Typography variant="h4" sx={{ mb: 5 }}>
       Trip Reports
     </Typography>

     <Card sx={{ p: 4, mb: 4, backgroundColor: 'white' }}>
       <FormControl fullWidth sx={{ mb: 3 }}>
         <InputLabel>Report Type</InputLabel>
         <Select
           value={reportType}
           label="Report Type"
           onChange={handleReportTypeChange}
         >
           <MenuItem value="date">Trips by Date Range</MenuItem>
           <MenuItem value="destination">Trips by Destination</MenuItem>
         </Select>
       </FormControl>

       {reportType === 'date' && (
         <div style={{ 
           display: 'grid', 
           gridTemplateColumns: '1fr 1fr', 
           gap: '20px'
         }}>
           <div>
             <Typography variant="body2" sx={{ mb: 1 }}>Start Date</Typography>
             <TextField
               fullWidth
               type="date"
               value={startDate}
               onChange={(e) => {
                 console.log("New start date:", e.target.value); // Debug log
                 setStartDate(e.target.value);
               }}
               sx={{ backgroundColor: 'white' }}
             />
           </div>
           <div>
             <Typography variant="body2" sx={{ mb: 1 }}>End Date</Typography>
             <TextField
               fullWidth
               type="date"
               value={endDate}
               onChange={(e) => {
                 console.log("New end date:", e.target.value); // Debug log
                 setEndDate(e.target.value);
               }}
               sx={{ backgroundColor: 'white' }}
             />
           </div>
         </div>
       )}

       {reportType === 'destination' && (
         <FormControl fullWidth sx={{ mb: 2 }}>
           <InputLabel>Destination</InputLabel>
           <Select
             value={destination}
             label="Destination"
             onChange={(e) => setDestination(e.target.value)}
           >
             <MenuItem value="all">All Destinations</MenuItem>
             {getUniqueDestinations().map(dest => (
               <MenuItem key={dest} value={dest}>{dest}</MenuItem>
             ))}
           </Select>
         </FormControl>
       )}
     </Card>

     {isLoading && statistics && (
       <Card sx={{ p: 3, mb: 4, backgroundColor: 'white' }}>
         <Typography variant="h6" sx={{ mb: 2 }}>Report Statistics</Typography>
         <Grid container spacing={3}>
           <Grid item xs={12} md={6}>
             <Box sx={{ mb: 2 }}>
               <Typography variant="subtitle2" color="textSecondary">
                 Total Trips
               </Typography>
               <Typography variant="h4">
                 {statistics.totalTrips}
               </Typography>
             </Box>
             {statistics.mostCommonDestination && (
               <Box sx={{ mb: 2 }}>
                 <Typography variant="subtitle2" color="textSecondary">
                   Most Common Destination
                 </Typography>
                 <Typography variant="body1">
                   {statistics.mostCommonDestination.name} ({statistics.mostCommonDestination.count} trips)
                 </Typography>
               </Box>
             )}
           </Grid>
           <Grid item xs={12} md={6}>
             <Box sx={{ mb: 2 }}>
               <Typography variant="subtitle2" color="textSecondary">
                 Date Range
               </Typography>
               <Typography variant="body1">
                 {formatDateForDisplay(statistics.dateRange.earliest)} - {formatDateForDisplay(statistics.dateRange.latest)}
               </Typography>
             </Box>
             <Box sx={{ mb: 2 }}>
               <Typography variant="subtitle2" color="textSecondary">
                 Total Destinations
               </Typography>
               <Typography variant="body1">
                 {Object.keys(statistics.destinationBreakdown).length}
               </Typography>
             </Box>
           </Grid>
         </Grid>
       </Card>
     )}

     {isLoading && filteredTrips.length > 0 && (
       <TableContainer component={Paper}>
         <Typography variant="h6" sx={{ p: 2 }}>
           {reportType === 'date' && startDate && endDate && 
             `Trips by Date Range Report (${formatDateInput(startDate)} - ${formatDateInput(endDate)})`
           }
           {reportType === 'destination' && `Trips by Destination: ${destination}`}
         </Typography>
         <Table sx={{ minWidth: 650 }}>
           <TableHead>
             <TableRow>
               <TableCell align="center" sx={{ color: 'purple' }}>Actions</TableCell>
               <TableCell sx={{ color: 'purple' }}>Trips</TableCell>
               <TableCell align="right" sx={{ color: 'purple' }}>Destination</TableCell>
               <TableCell align="right" sx={{ color: 'purple' }}>Specific Place</TableCell>
               <TableCell align="right" sx={{ color: 'purple' }}>Date</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {filteredTrips.map((row, index) => (
               <TableRow key={index}>
                 <TableCell align="center">
                   <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                     <Tooltip title="View Trip Details">
                       <IconButton onClick={() => handleViewTrip(row)}>
                         <VisibilityIcon color="primary" fontSize="small" />
                       </IconButton>
                     </Tooltip>
                     <Tooltip title="Copy to Clipboard">
                       <IconButton onClick={() => handleCopyTrip(row)}>
                         <ContentCopyIcon color="primary" fontSize="small" />
                       </IconButton>
                     </Tooltip>
                     <Tooltip title="Edit Trip">
                       <IconButton onClick={() => handleEditTrip(row)}>
                         <EditIcon color="primary" fontSize="small" />
                       </IconButton>
                     </Tooltip>
                     <Tooltip title="Delete Trip">
                       <IconButton onClick={() => handleDeleteTrip(row)}>
                         <DeleteIcon color="error" fontSize="small" />
                       </IconButton>
                     </Tooltip>
                   </div>
                 </TableCell>
                 <TableCell>{row.lessonTitle || row.tripTitle}</TableCell>
                 <TableCell align="right">{row.subject || row.destination}</TableCell>
                 <TableCell align="right">{row.grade || row.specificPlace}</TableCell>
                 <TableCell align="right">
                   {formatDateForDisplay(row.timestamp.seconds * 1000)}
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </TableContainer>
     )}

     {!isLoading && <div>Loading...</div>}
     {isLoading && filteredTrips.length === 0 && (
       <Typography>No trips found for the selected criteria.</Typography>
     )}

     {/* Trip Details Modal */}
     <Dialog 
       open={viewModalOpen} 
       onClose={() => setViewModalOpen(false)}
       maxWidth="md"
       fullWidth
     >
       <DialogTitle>
         {selectedTrip?.lessonTitle || selectedTrip?.tripTitle}
       </DialogTitle>
       <DialogContent>
         <Box sx={{ mb: 2 }}>
           <Typography variant="body2" color="textSecondary">
             <strong>Destination:</strong> {selectedTrip?.subject || selectedTrip?.destination}
           </Typography>
           <Typography variant="body2" color="textSecondary">
             <strong>Specific Place:</strong> {selectedTrip?.grade || selectedTrip?.specificPlace}
           </Typography>
           <Typography variant="body2" color="textSecondary">
             <strong>Date Created:</strong> {selectedTrip && new Date(selectedTrip.timestamp.seconds * 1000).toLocaleDateString("en-US", {
               month: "long",
               day: "numeric",
               year: "numeric",
             })}
           </Typography>
         </Box>
         <Typography 
           variant="body1" 
           sx={{ 
             whiteSpace: "pre-line", 
             mt: 2,
             p: 2,
             bgcolor: '#f5f5f5',
             borderRadius: 1
           }}
         >
           {selectedTrip?.generatedLesson || selectedTrip?.generatedTrip}
         </Typography>
       </DialogContent>
       <DialogActions>
         <Button onClick={() => setViewModalOpen(false)}>
           Close
         </Button>
         <Button 
           onClick={() => handleCopyTrip(selectedTrip)}
           variant="contained"
         >
           Copy to Clipboard
         </Button>
       </DialogActions>
     </Dialog>

     {/* Edit Trip Modal */}
     <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
       <DialogTitle>Edit Trip</DialogTitle>
       <DialogContent>
         <TextField
           autoFocus
           margin="dense"
           label="Trip Title"
           fullWidth
           value={editedTitle}
           onChange={(e) => setEditedTitle(e.target.value)}
           disabled={isUpdating}
         />
       </DialogContent>
       <DialogActions>
         <Button onClick={() => setEditModalOpen(false)} disabled={isUpdating}>
           Cancel
         </Button>
         <Button onClick={confirmEdit} color="primary" disabled={isUpdating}>
           {isUpdating ? 'Saving...' : 'Save'}
         </Button>
       </DialogActions>
     </Dialog>

     {/* Delete Trip Modal */}
     <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
       <DialogTitle>Delete Trip</DialogTitle>
       <DialogContent>
         <Typography>
           Are you sure you want to delete this trip? This action cannot be undone.
         </Typography>
       </DialogContent>
       <DialogActions>
         <Button onClick={() => setDeleteModalOpen(false)} disabled={isUpdating}>
           Cancel
         </Button>
         <Button onClick={confirmDelete} color="error" disabled={isUpdating}>
           {isUpdating ? 'Deleting...' : 'Delete'}
         </Button>
       </DialogActions>
     </Dialog>
   </Fragment>
 );
}

export default Reports;