import express from 'express';
import { sequelize } from './entities/model';
import profileRoutes from './routes/profileRoutes';
import jobsRoutes from './routes/jobsRoutes';
import balancesRoutes from './routes/balancesRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

const port = 3001 || process.env.PORT;
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(profileRoutes);
app.use(jobsRoutes);
app.use(balancesRoutes);
app.use(adminRoutes);

app.listen(port, () => {
  console.log('listening on port 🚀', port);
});
