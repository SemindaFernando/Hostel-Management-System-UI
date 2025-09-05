const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    unique: true,
    trim: true
  },
  floor: {
    type: String,
    required: [true, 'Floor is required'],
    enum: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor']
  },
  type: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['2 Sharing', '4 Sharing']
  },
  gender: {
    type: String,
    required: [true, 'Gender specification is required'],
    enum: ['Boys', 'Girls', 'Mixed']
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [4, 'Capacity cannot exceed 4']
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    min: [0, 'Occupancy cannot be negative']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price cannot be negative']
  },
  pricePerWeek: {
    type: Number,
    required: [true, 'Price per week is required'],
    min: [0, 'Price cannot be negative']
  },
  pricePerMonth: {
    type: Number,
    required: [true, 'Price per month is required'],
    min: [0, 'Price cannot be negative']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance', 'Reserved'],
    default: 'Available'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Virtual for availability
roomSchema.virtual('isAvailable').get(function() {
  return this.currentOccupancy < this.capacity && this.status === 'Available';
});

// Method to check availability for specific dates
roomSchema.methods.checkAvailability = async function(startDate, endDate) {
  const Booking = mongoose.model('Booking');
  const conflictingBookings = await Booking.find({
    room: this._id,
    status: { $in: ['active', 'confirmed'] },
    $or: [
      {
        checkIn: { $lte: endDate },
        checkOut: { $gte: startDate }
      }
    ]
  });
  
  return conflictingBookings.length === 0 && this.isAvailable;
};

module.exports = mongoose.model('Room', roomSchema);