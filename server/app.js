const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRouter = require('./routes/user.routers');
const authRouter = require('./routes/auth.routers');
const postRouter = require('./routes/post.routers');
const uploadRouter = require('./routes/upload.router');
const cookieParser = require('cookie-parser');
require('./services/redis');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/assets', express.static(path.join(__dirname, 'public/assets')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//Custom express error handler
app.use((error, req, res, next) => {
  res.status(error.status || 5000);
  res.json({
    status: error.status,
    message: error.message,
  });
});

module.exports = app;