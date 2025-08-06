import { Router } from 'express';
import AuthService from '../services/auth.service';
import { ILogin, IRegister } from '../interfaces/user.interface';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const userData: IRegister = req.body;
    const user = await AuthService.register(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const credentials: ILogin = req.body;
    const { user, token } = await AuthService.login(credentials);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json(req.user);
});

export default router;