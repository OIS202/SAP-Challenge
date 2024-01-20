const fs = require('fs');
const csv = require('csv-parser');
const Booking = require('./Booking');

const filePath = 'C:\\Users\\oimbs\\Documents\\sapchallenge\\datafile.csv';

const bookings = [];

fs.createReadStream(filePath)
  .pipe(csv({
    headers: false,
    mapValues: ({ index, value }) => index === 0 || index === 1 ? new Date(value).toISOString() : value
  }))
  .on('data', (data) => {
    // Process each row of the CSV data
    const bookingDate = data[0];
    console.log(typeof bookingDate)
    const appointmentDate = data[1];
    const vehicleType = data[2];
    const bookingType = bookingDate === appointmentDate ? 'Walk-in' : 'Booking';

    // Create a Booking instance
    const currentBooking = new Booking(bookingDate, appointmentDate, vehicleType, bookingType);

    // Optionally, store the Booking instance in an array
    bookings.push(currentBooking);
  })
  .on('end', () => {
    // The 'end' event indicates that all rows have been read
    bookings.sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate));
    console.log('All bookings processed:', bookings);
    // Perform further processing here
  })
  .on('error', (error) => {
    console.error('Error reading the CSV file:', error);
  });





