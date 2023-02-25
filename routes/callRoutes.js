const express = require('express');
const {
  gatherIncomingCall,
  handleIncomingCall,
  handleVoicemailRecording,
  addCallLogs,
  getAllCalls,
  getCallById,
} = require('../controllers/callController');

const router = express.Router();

//Gather incoming calls
router.post('/incomingCall',gatherIncomingCall);

// Handle incoming calls
router.post('/', handleIncomingCall);

//Add Call logs
router.post('/addCalls',addCallLogs);

// Handle voicemail recording
router.post('/voicemail', handleVoicemailRecording);

// Get all calls
router.get('/', getAllCalls);

// Get a call by ID
router.get('/:callId', getCallById);

module.exports = router;