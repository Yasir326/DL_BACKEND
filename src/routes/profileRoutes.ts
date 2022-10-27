import express from 'express';
import { getProfile } from '../middleware/getProfile';
import {
  getContractsById,
  getAllContracts
} from '../controllers/profileController';

const router = express.Router();

router.get('/contracts/:id', getProfile, getContractsById);
router.get('/contracts', getProfile, getAllContracts);

export default router;
