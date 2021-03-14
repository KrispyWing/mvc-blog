const router = require('express').Router();
const { User } = require('../../models');

// Get All users
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    res.status(500).json(err);
  });
});

// Get a single user by id number
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    }
  })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No User found with this id' });
      return;
    }
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

//create a new user
router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password
  })
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    res.status(500).json(err);
  });
});

//login route
 router.post('/login', (req, res) => {
   User.findOne({
     where: {
       username: req.body.username
     }
   })
   .then(dbUserData => {
     //verify user
     if(!dbUserData) {
       res.status(400).json({ message: 'Username not Found' });
       return;
     }
     const validPassword = dbUserData.checkPassword(req.body.password);
     if (!validPassword) {
       res.status(400).json({ message: 'Incorrect Password' });
       return;
     }
     res.json({user: dbUserData, message: 'You are now logged in!' });
   })
 })

//update a user by id number
router.put('/:id', (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
  .then(dbUserData => {
    if (!dbUserData[0]) {
      res.status(404).json({ message: 'No User found with this id' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

//Delete a user by id number
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No User found with this id' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});


module.exports = router;