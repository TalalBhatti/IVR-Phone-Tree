const express = require('express');
const {
  handleIncomingCall,
  handleVoicemailRecording,
  getAllCalls,
  getCallById,
} = require('../controllers/callController');

const router = express.Router();

// Handle incoming calls
router.post('/', handleIncomingCall);

// Handle voicemail recording
router.post('/voicemail', handleVoicemailRecording);

// Get all calls
router.get('/', getAllCalls);

// Get a call by ID
router.get('/:callId', getCallById);

module.exports = router;