const Call = require('../models/callModel');
const twilioClient = require('../config/twilio');
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const logger = require('../utils/logger');

// Configuring incoming call
const gatherIncomingCall = async (req, res, next) => {
  try {
    const twiml = new VoiceResponse();

    const helper = twiml.gather({
      numDigits: 1,
      action: "/api/calls/",
    })

    helper.say("For assistance, press 1. To drop a message, press 2.")
    twiml.redirect("/api/calls/incomingCall")

    res.set("Content-Type", "text/xml");
    res.send(twiml.toString());
  }
  catch (err) {
    next(err)
  }

}

// Handle incoming calls
const handleIncomingCall = async (req, res, next) => {
  try {
    const twiml = new VoiceResponse();
    const option = req.body.Digits;
    if (option === '1') {
      // Redirect to personal phone
      const dial = twiml.dial();
      dial.number(process.env.PERSONAL_PHONE);
    } else if (option === '2') {
      // Record voicemail
      const gather = twiml.gather({
        input: 'dtmf',
        timeout: 5,
        numDigits: 1,
      });
      gather.say('Please leave a message after the beep.');
      twiml.record({
        maxLength: 30,
        action: '/api/calls/voicemail',
        method: 'POST',
      });
    } else {
      // Invalid option
      twiml.say('Sorry, that is not a valid option. Goodbye.');
      twiml.hangup();
    }
    res.type('text/xml').send(twiml.toString());
  } catch (err) {
    next(err);
  }
};

// Handle voicemail recording
const handleVoicemailRecording = async (req, res, next) => {
  try {
    const recordingUrl = req.body.RecordingUrl;
    const callSid = req.body.CallSid;
    const duration = req.body.RecordingDuration;
    // Save voicemail to database
    const call = await Call.findOneAndUpdate({ sid: callSid }, {
      $set: { voicemail: { url: recordingUrl, duration } },
    });
    if (!call) {
      logger.error(`Call with SID ${callSid} not found`);
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const addCallLogs = async (req, res, next) => {

  const { sid } = req.body
  let data

  try {
    await twilioClient.calls(sid)
      .fetch()
      .then(call => {
        data = call
      });
    let RegisterCallId = new CallLogs({
      CallId: data.sid,
      CallStatus: data.status,
      CallDuration: data.duration,
      CallFromNumber: data.from,
      RecordingUrlFile: data.subresourceUris.recordings
    })

    await RegisterCallId.save()

    return res.status(200).json({ success: true });
  }
  catch (err) {
    next(err)
  }
}

// Get all calls
const getAllCalls = async (req, res, next) => {
  try {
    const calls = await Call.find({});
    res.json(calls);
  } catch (err) {
    next(err);
  }
};

// Get a call by ID
const getCallById = async (req, res, next) => {
  try {
    const call = await Call.findById(req.params.callId);
    if (!call) {
      return res.status(404).json({
        error: 'Call not found',
      });
    }
    res.json(call);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  gatherIncomingCall,
  handleIncomingCall,
  handleVoicemailRecording,
  addCallLogs,
  getAllCalls,
  getCallById,
};