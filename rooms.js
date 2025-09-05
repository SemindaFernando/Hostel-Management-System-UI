const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Room = require('../Models/Room');
const { auth } = require('../Middleware/auth');

const router = express.Router();

// Get all rooms with filters
router.get('/', [
  query('type').optional().isIn(['2 Sharing', '4 Sharing']),
  query('gender').optional().isIn(['Boys', 'Girls', 'Mixed']),
  query('floor').optional().isIn(['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor']),
  query('available').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const { type, gender, floor, available, checkIn, checkOut } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (gender) filter.gender = gender;
    if (floor) filter.floor = floor;
    if (available === 'true') filter.status = 'Available';

    let rooms = await Room.find(filter).sort({ roomNumber: 1 });

    if (checkIn && checkOut) {
      const availableRooms = [];
      for (const room of rooms) {
        const isAvailable = await room.checkAvailability(new Date(checkIn), new Date(checkOut));
        if (isAvailable) {
          availableRooms.push(room);
        }
      }
      rooms = availableRooms;
    }

    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      data: room
    });

  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room'
    });
  }
});

module.exports = router;