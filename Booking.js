// Booking.js

class Booking {
    constructor(bookingDate, appointmentDate, vehicleType, bookingType) {
      this.bookingDate = bookingDate;
      this.appointmentDate = appointmentDate;
      this.vehicleType = vehicleType;
      this.bookingType = bookingType;
    }
  
    displayBookingDetails() {
      console.log('Booking Date:', this.bookingDate);
      console.log('Appointment Date:', this.appointmentDate);
      console.log('Vehicle Type:', this.vehicleType);
      console.log('Booking Type:', this.bookingType);
    }
  }
  
  module.exports = Booking;
  

module.exports = Booking;
