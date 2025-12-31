import express from 'express';
import { getUsers, getLogs, updateUserStatus, deleteUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/access-control/users', getUsers);
router.get('/access-control/logs', getLogs);
router.patch('/access-control/users/:userId/status', updateUserStatus);
router.delete('/access-control/users/:userId', deleteUser);

export default router;
