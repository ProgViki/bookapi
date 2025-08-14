import { Router } from 'express';
import { ILogin, IRegister } from '../interfaces/user.interface';
import { authenticate } from '../middleware/auth.middleware';
import AuthService from '../services/auth.service';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const userData: IRegister = req.body;
    const user = await AuthService.register(userData);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const credentials: ILogin = req.body;
    const { user, token } = await AuthService.login(credentials);
    res.json({ user, token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

// Get current logged-in user
router.get('/me', authenticate, async (req: any, res) => {
  res.json(req.user);
});

// Get all users (protected)
router.get('/users', authenticate, async (req, res) => {
  try {
    const users = await AuthService.getUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID (protected)
router.get('/users/:id', authenticate, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await AuthService.getUserById(userId);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
