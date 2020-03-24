const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');
const getUser = require('../auth/getUser-middleware');

router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.get("/department", restricted, getUser, (req, res) => {
  const department = req.user.department;
  Users.findBy({department})
    .then(users => {
      if (users.length === 0) {
        res.status(404).json({message: "No users in specified department."})
      }
      else {
      res.status(200).json(users)
      }
    })
    .catch(err => res.status(500).json({error: "Server error, could not get users."}))
})

module.exports = router;
