const fs = require("fs");
const csv = require("csv-parser");
const Booking = require("./Booking");

const filePath = "datafile.csv";

const processCSV = () => {
  return new Promise((resolve, reject) => {
    const bookings = [];

    fs.createReadStream(filePath)
      .pipe(
        csv({
          headers: false,
          mapValues: ({ index, value }) =>
            index === 0 || index === 1 ? new Date(value) : value,
        })
      )
      .on("data", (data) => {
        // Process each row of the CSV data
        const bookingDate = data[0];
        const appointmentDate = data[1];
        const vehicleType = data[2];
        const bookingDateObj = new Date(bookingDate);
        const appointmentDateObj = new Date(appointmentDate);
        const bookingType =
          bookingDateObj.getTime() === appointmentDateObj.getTime() ? "Walk-in" : "Booking";

        // Convert date strings to Date objects
        

        // Create a Booking instance
        const currentBooking = new Booking(
          bookingDateObj,
          appointmentDateObj,
          vehicleType,
          bookingType
        );

        // Optionally, store the Booking instance in an array
        bookings.push(currentBooking);
      })
      .on("end", () => {
        // The 'end' event indicates that all rows have been read
        bookings.sort((a, b) => a.bookingDate - b.bookingDate);
        // console.log(bookings)
        // Resolve the promise with the processed bookings
        resolve(bookings);
      })
      .on("error", (error) => {
        // Reject the promise with an error if there is one
        reject(error);
      });
  });
};

const processBookings = (bookings) => {
  const approvedBookings = [];
  const rejectedBookings = [];

  bookings.forEach((currentBooking) => {

    // Criteria 1: Appointment time is greater than 7am
    const appointmentTime = currentBooking.appointmentDate.getHours();
    if (appointmentTime < 7) {
      rejectedBookings.push({
        booking: currentBooking,
        reason: "Appointment time is before 7am",
      });
      return;
    }

    if (appointmentTime > 19) {
        rejectedBookings.push({
          booking: currentBooking,
          reason: "Appointment time is after 7pm",
        });
        return;
      }

    if (currentBooking.appointmentDate.getTime() <= currentBooking.bookingDate.getTime()) {
    rejectedBookings.push({
        booking: currentBooking,
        reason: "Appointment time is after 7pm",
    });
    return;
    }

    // Criteria 2: Appointment time + service time is less than 7pm
    const serviceTime = currentBooking.serviceTime; // Assuming service time is 2 hours, adjust as needed
    const endTime = appointmentTime + serviceTime;
    if (endTime > 19) {
      rejectedBookings.push({
        booking: currentBooking,
        reason: "Appointment time exceeds 7pm",
      });
      return;
    }

    // Criteria 3: No more than 5 reservations at a given time according to the date
    
    // All criteria passed, add to approved bookings
    approvedBookings.push(currentBooking);
  });


  // Additional processing or logging can be done here

  return { approvedBookings, rejectedBookings };
};

// Use the Promise to ensure processing happens after CSV parsing is complete
processCSV()
  .then((bookings) => {
    const walkIns = bookings.filter((booking) => booking.bookingType === 'Walk-in');
    bookings = bookings.filter((booking) => booking.bookingType !== 'Walk-in');
    const { approvedBookings, rejectedBookings } = processBookings(bookings);
    console.log("Approved Bookings:", approvedBookings.length);
    console.log("Rejected Bookings:", rejectedBookings.length);
  })
  .catch((error) => {
    console.error("Error processing CSV:", error);
  });
