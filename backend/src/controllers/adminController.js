import User from '../models/User.js';
import SecurityLog from '../models/SecurityLog.js';

export const getUsers = async (req, res, next) => {
    try {
        const { role, status, search } = req.query;
        let query = {};
        if (role && role !== 'all') query.domain = role;
        if (status && status !== 'all') query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        const users = await User.find(query).sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        next(error);
    }
};

export const getLogs = async (req, res, next) => {
    try {
        const logs = await SecurityLog.find().sort({ timestamp: -1 }).limit(100);
        res.json({ success: true, logs });
    } catch (error) {
        next(error);
    }
};

export const updateUserStatus = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const log = new SecurityLog({
            type: status === 'active' ? 'success' : 'danger',
            action: `User ${status === 'active' ? 'activated' : 'suspended'}`,
            user: 'Admin',
            time: new Date().toLocaleTimeString(),
            ip: req.ip,
            details: `${user.name} status changed to ${status}`,
            domain: user.domain
        });
        await log.save();

        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const log = new SecurityLog({
            type: 'danger',
            action: 'User deleted',
            user: 'Admin',
            time: new Date().toLocaleTimeString(),
            ip: req.ip,
            details: `${user.name} was deleted from the system`,
            domain: user.domain
        });
        await log.save();
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};
