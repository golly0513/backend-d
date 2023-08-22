const express = require("express");
const connectDB = require("./config/db");
const auth = require('./routes/api/auth');
const bodyParser = require("body-parser");
const app = express();

// Connect Database
connectDB();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Define Routes
app.use('/api/auth', auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));