// BUILD YOUR SERVER HERE

//# IMPORTS
const express = require('express');
const User = require('./users/model');

//# Create Express Instance
const server = express();

//# Middleware
server.use(express.json());


// ENDPOINTS

//? [GET] /api/users (Returns all users) (Read)
server.get('/api/users', (req, res) => {
  User.find()
    .then(users => {
      console.log('users from the model -->', users)
      // throw new Error()
      res.status(200).json({ users })
    })
    .catch(err => {
      res.status(500).json({ message: 'The users information could not be retrieved' })
    })
})

//? [GET] /api/users/:id (Returns specified user) (Read)
server.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId
  User.findById(userId)
    .then(user => {
      // throw new Error()
      if (!user) {
        res.status(404).json({ message: 'The user with the specified ID does not exist' })
      } else {
        res.json(user)
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'The user information could not be retrieved'})
    })
})

//? [POST] /api/users (Create new user) (Create)
server.post('/api/users', (req, res) => {
  const newUser = req.body
  if (!newUser.name || !newUser.bio) {
    res.status(400).json({ message: 'Please provide name and bio for the user'})
  } else {
    User.insert(newUser)
      .then(user => {
        res.status(201).json({ user })
      })
      .catch(err => {
        res.status(500).json({ message: 'There was an error while saving the user to the database'})
      })
  }
})

//? [PUT] /api/users/:id (Update user) (Update)
server.put('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('user id to update: ', userId)
  const changes = req.body
  console.log('The changes to make: ', changes)

  try {
    if (!changes.name || !changes.bio){
      res.status(400).json({ message: "Please provide name and bio for the user" })
    } else {
      const updatedUser = await User.update(userId, changes)
      if (!updatedUser) {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      } else {
        res.json({ updatedUser })
      }
    }
  } catch(err){
    res.status(500).json({ message: "The user information could not be modified" })
  }
  
})

//? [DELETE] /api/users/:id (Delete User) (Delete)
  server.delete('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const deleted = await User.remove(userId)
      if (!deleted) {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      } else {
        res.json(deleted);
      }
    } catch(err) {
      res.status(500).json({ message: "The user could not be removed" })
    }
  })

//? [GET] / (404 Catch All)
server.use('*', (req,res) => {
  res.status(404).json({ message: 'This page doesn\'t exist!'})
})

//# Exposing Server to other modules
module.exports = server; // EXPORT YOUR SERVER instead of {}
