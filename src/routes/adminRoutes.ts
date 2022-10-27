import express from 'express';
import { getProfile } from '../middleware/getProfile';
import { bestProfession, bestClient } from '../controllers/adminController';

const router = express.Router();

router.get('/admin/best-profession', getProfile, bestProfession);

router.get('/admin/best-clients', getProfile, bestClient);

export default router;
