import express from 'express';
import { getProfile } from '../middleware/getProfile';
import { deposit } from '../controllers/balancesController';

const router = express.Router();

router.post('/balances/deposit/:userId', getProfile, deposit);

export default router;
