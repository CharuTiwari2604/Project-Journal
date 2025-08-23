const express = require('express');
const { registerUser, loginUser } = require('../controller/authController');
const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
});


module.exports = authRouter;


