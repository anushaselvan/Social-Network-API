const { User } = require('../models');

module.exports = {
  // Get all Users
  getUsers(req, res) {
    User.find({})
      .then((UserObj) => res.json(UserObj))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single User
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .then((User) =>
        !User
          ? res.status(404).json({ message: 'No User with that ID' })
          : res.json(User)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new User
  createUser(req, res) {
    User.create(req.body)
      .then((User) => res.json(User))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a User
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((User) =>
        !User
          ? res.status(404).json({ message: 'No such User exists' })
          : res.json(User)
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
      //Update a User
    updateUser(req, res) {
      User.findOneAndUpdate(
        { _id: req.params.userId }, 
        { $set: req.body },
        {new:true})
        .then((User) =>
          !User
            ? res.status(404).json({ message: 'No such User exists' })
            : res.json(User)
            )
            .catch((err) => {
              console.log(err);
              res.status(500).json(err);
            });
      },
        

  // Add an Friend to a User
  addFriend(req, res) {
    console.log('You are adding a Friend');
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      {new: true }
    )
      .then((User) =>
        !User
          ? res
              .status(404)
              .json({ message: 'No User found with that ID :(' })
          : res.json(User)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove Friend from a User
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId  } },
      {new: true }
    )
      .then((User) =>
        !User
          ? res
              .status(404)
              .json({ message: 'No User found with that ID :(' })
          : res.json(User)
      )
      .catch((err) => res.status(500).json(err));
  },
};
