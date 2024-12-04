const mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
function createSessionStore(session) {
  const mongoStore = MongoDBStore(session);
  const store = new mongoStore(
    {
      uri: process.env.MONGO_URI,
      collection: 'sessions',
    },
    function (error) {
      if (error) {
        console.log(error);
      }
    }
  );

  store.on('error', function (error) {
    console.log('Session store error:', error);
  });

  return store;
}

module.exports = { connectDB, createSessionStore };
