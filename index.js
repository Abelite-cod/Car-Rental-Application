const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const userRouter = require('./src/routes/user.routes');
const carRouter = require('./src/routes/car.routes');
const paymentRouter = require('./src/routes/payment.routes');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Welcome To My Homepage'));

app.use('/api/users', userRouter);
app.use('/api/cars', carRouter);
app.use('/api/payment', paymentRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
