// Booking.js

class Booking {
    constructor(bookingDate, appointmentDate, vehicleType, bookingType) {
      this.bookingDate = bookingDate;
      this.appointmentDate = appointmentDate;
      this.vehicleType = vehicleType;
      this.bookingType = bookingType;
      
      // Additional data members
      this.serviceTime = this.calculateServiceTime();
      this.charge = this.calculateCharge();
    }
  
    calculateServiceTime() {
      // Calculate and return the service time based on the vehicle type
      switch (this.vehicleType) {
        case 'compact':
        case 'medium':
        case 'full-size':
          return 0.5; // 30 minutes for compact, medium, and full-size cars
        case 'class 1 truck':
          return 1; // 1 hour for class 1 truck
        case 'class 2 truck':
          return 2; // 2 hours for class 2 truck
        default:
          return 0; // Default to 0 for unknown vehicle types
      }
    }
  
    calculateCharge() {
      // Calculate and return the charge based on the service time and vehicle type
      switch (this.vehicleType) {
        case 'compact':
        case 'medium':
        case 'full-size':
          return 150; // $150 charge for compact, medium, and full-size cars
        case 'class 1 truck':
          return 250; // $250 charge for class 1 truck
        case 'class 2 truck':
          return 700; // $700 charge for class 2 truck
        default:
          return 0; // Default to 0 for unknown vehicle types
      }
    }
  
    displayBookingDetails() {
      console.log('Booking Date:', this.bookingDate);
      console.log('Appointment Date:', this.appointmentDate);
      console.log('Vehicle Type:', this.vehicleType);
      console.log('Booking Type:', this.bookingType);
      console.log('Service Time:', this.serviceTime, 'minutes');
      console.log('Charge:', '$' + this.charge);
    }
  }
  
  module.exports = Booking;
  
