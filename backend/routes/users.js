var express = require('express');
var router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res) => {
  try {
    let { email, password, username } = req.body;
    if (!email || !password || !username)
      return res.status(400).json({ msg: 'Email/Username/Password Required.' });

    let user = await User.create(req.body);

    if (!user) res.status(500).json({ msg: 'User Not Created!' });

    res.status(200).json(user);
  } catch (error) {
    if (error.keyValue.username === req.body.username) {
      return res.status(400).json({ msg: 'Username already Taken' });
    }
    if (error.keyValue.email === req.body.email)
      return res.status(400).json({ msg: 'Email already Register' });
    res.status(500).json({ msg: error.msg || error });
  }
});

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: 'Email/Password Required.' });

    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: 'Email is Incorrect !' });

    let verified = await user.verifyPassword(password);

    if (!verified)
      return res.status(400).json({ msg: 'Password is incorrect.' });

    let token = await user.signToken();

    res.status(200).json(user.userJSON(token));
  } catch (error) {
    res.status(500).json({ msg: error.msg || error });
  }
});

module.exports = router;
