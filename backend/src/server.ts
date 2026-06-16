import express from 'express';
import cors from 'cors';
import adRoutes from './routes/adRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", adRoutes);

app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});