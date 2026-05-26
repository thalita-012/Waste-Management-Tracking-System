// import express from "express";
// const app = express();
// app.use(express.json());
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
import express from 'express';
import paymentRoutes from './routes/paymentRoute.ts';

const app = express();

app.use(express.json());
app.use('/api/payments', paymentRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});