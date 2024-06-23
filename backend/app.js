
const express = require('express');
const databaseconnect = require('./config/databaseConfig');
const authRouter = require('./router/authRoute');

const cookieParser = require('cookie-parser');

const cors = require('cors');

const app = express();

databaseconnect();

app.use(cors({
     origin: [process.env.CLIENT_URL],
     credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

app.use('/', (req, res) => {
     res.status(200).json({
          success: true,
          data: "jwt auth server"
     });
});

module.exports = app;


