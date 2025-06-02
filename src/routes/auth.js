const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authLimiter } = require('../middleware/rateLimit');

const usersFilePath = path.join(__dirname, '../../data/users.json');

router.post('/register', authLimiter, async (req, res) => {
  const { username, password } = req.body;
  try {
    const usersData = await fs.readFile(usersFilePath, 'utf8');
    const { users } = JSON.parse(usersData);

    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    await fs.writeFile(usersFilePath, JSON.stringify({ users }, null, 2));
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;
  try {
    const usersData = await fs.readFile(usersFilePath, 'utf8');
    const { users } = JSON.parse(usersData);

    const user = users.find(user => user.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 