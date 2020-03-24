const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth

router.get('/' , (req, res) => {
  res.status(200).send('Auth router is up.')
})

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json({message: `Successfully created user '${saved.username}' in department '${saved.department}'.`});
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;


  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
    department: user.department
  }
  const secret = require("../config/secrets").jwtSecret;
  const options = {
    expiresIn: '15m'
  }

  return jwt.sign(payload, secret, options);
}

module.exports = router;
