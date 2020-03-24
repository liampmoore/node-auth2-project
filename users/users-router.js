const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.get("/department", restricted, (req, res) => {

  Users.findBy({department: req.decodedToken.department})
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
