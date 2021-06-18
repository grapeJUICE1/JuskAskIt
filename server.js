/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socketIO = require('socket.io');
const http = require('http');
const Notification = require('./models/notifications');

// handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

// initializing mongoose and mongodb
let databaseURI = '';
if (process.env.NODE_ENV === 'development')
  databaseURI = process.env.DATABASE_LOCAL;
else if (process.env.NODE_ENV === 'production')
  databaseURI = process.env.DATABASE_PROD;
else {
  databaseURI = process.env.DATABASE_PROD;
}

mongoose
  .connect(process.env.DATABASE_PROD, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected Successfully');
  });

const port = process.env.PORT;

// spinning up the server
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  socket.on('join', async (userId) => {
    socket.join(userId);
  });
  socket.on('initial_data', async (userId) => {
    const notification = await Notification.find({ user: userId })
      .sort({
        createdAt: -1,
      })
      .limit(5);
    io.to(userId).emit('get_data', notification);
  });
  socket.on('check_all_notifications', async (userId) => {
    const notifications = await Notification.find({
      user: userId,
      read: false,
    });

    notifications.forEach(async (notification) => {
      notification.read = true;
      await notification.save();
    });

    io.to(userId).emit('change_data');
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports.ioObject = io;

server.listen(port, () => {
  console.log(
    `
    ################################################
    🛡️  Server listening on port: ${port} 🛡️
    ################################################
  `
  );
});
// console.log('kkk');
// handling unhandled rejection
process.on('unhandledRejection', (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
