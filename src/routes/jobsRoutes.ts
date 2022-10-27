import express from 'express';
import { getProfile } from '../middleware/getProfile';
import { getUnpaidJobs, payForJob } from '../controllers/jobsController';

const router = express.Router();

router.get('/jobs/unpaid', getProfile, getUnpaidJobs);
router.post('/jobs/:job_id/pay', getProfile, payForJob);

export default router;
