const mongoose = require('mongoose');

const connectToDatabase = (uri) => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
};

module.exports = connectToDatabase; 