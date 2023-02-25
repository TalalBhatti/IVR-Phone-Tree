const mongoose = require('mongoose');

const voicemailSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const callSchema = new mongoose.Schema({
  sid: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  voicemail: voicemailSchema,
});

const Call = mongoose.model('Call', callSchema);

module.exports = Call;