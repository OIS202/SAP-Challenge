const fs = require("fs");
const csv = require("csv-parser");
const Booking = require("./Booking");

const filePath = "../SAP-Challenge/datafile.csv";

const bookings = [];

fs.createReadStream(filePath)
  .pipe(
    csv({
      headers: false,
      mapValues: ({ index, value }) =>
        index === 0 || index === 1 ? new Date(value).toISOString() : value,
    })
  )
  .on("data", (data) => {
    // Process each row of the CSV data
    const bookingDate = data[0];
    const appointmentDate = data[1];
    const vehicleType = data[2];
    const bookingType = bookingDate === appointmentDate ? "Walk-in" : "Booking";

    // Create a Booking instance
    const currentBooking = new Booking(
      bookingDate,
      appointmentDate,
      vehicleType,
      bookingType
    );

    // Optionally, store the Booking instance in an array
    bookings.push(currentBooking);
  })
  .on("end", () => {
    // The 'end' event indicates that all rows have been read
    bookings.sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate));
    console.log("All bookings processed:", bookings);
    // Perform further processing here
  })
  .on("error", (error) => {
    console.error("Error reading the CSV file:", error);
  });

function processBookings(bookings) {
  const approvedBookings = [];
  const rejectedBookings = [];

  bookings.forEach((currentBooking) => {
    // Convert string dates to Date objects
    currentBooking.bookingDate = new Date(currentBooking.bookingDate);
    currentBooking.appointmentDate = new Date(currentBooking.appointmentDate);

    // Criteria 1: Appointment time is greater than 7am
    const appointmentTime = currentBooking.appointmentDate.getHours();
    console.log(appointmentTime);
    if (appointmentTime < 7) {
      rejectedBookings.push({
        booking: currentBooking,
        reason: "Appointment time is before 7am",
      });
      return;
    }

    // Criteria 2: Appointment time + service time is less than 7pm
    const serviceTime = 2; // Assuming service time is 2 hours, adjust as needed
    const endTime = appointmentTime + serviceTime;
    if (endTime > 19) {
      rejectedBookings.push({
        booking: currentBooking,
        reason: "Appointment time exceeds 7pm",
      });
      return;
    }

    // Criteria 3: No more than 5 reservations at a given time according to the date
    const sameDayBookings = approvedBookings.filter(
      (booking) =>
        booking.appointmentDate.toDateString() ===
        currentBooking.appointmentDate.toDateString()
    );

    if (sameDayBookings.length >= 5) {
      rejectedBookings.push({
        booking: currentBooking,
        reason: "Exceeds maximum reservations for the day",
      });
      return;
    }

    // All criteria passed, add to approved bookings
    approvedBookings.push(currentBooking);
  });

  return { approvedBookings, rejectedBookings };
}
const { approvedBookings, rejectedBookings } = processBookings(bookings);
console.log(approvedBookings, rejectedBookings);
