const { User, Thought } = require('../models');
/*
// Aggregate function to get the number of friends for a single user
const friendCount = async () => 
  User.aggregate()
    .count('UserCount')
    .then((numberOfUsers) => numberOfUsers);

// Aggregate function for getting the overall grade using $avg
const grade = async (UserId) =>
  User.aggregate([
    {
      $unwind: '$Friends',
    },
    {
      $group: { _id: UserId, overallGrade: { $avg: '$Friends.score' } },
    },
  ]);*/

module.exports = {
  // Get all Users
  getUsers(req, res) {
    User.find({})
    .populate({
      path:"Thoughts",
      select:"-__v",
    })
      .select('-__v')
      .then(async (Users) => {
        const UserObj = {
          Users,
        //  headCount: await headCount(),
        };
        return res.json(UserObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single User
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.UserId })
    .populate({
      path:"Thoughts",
      select:"-__v",
    })
      .select('-__v')
      .then(async (User) =>
        !User
          ? res.status(404).json({ message: 'No User with that ID' })
          : res.json({
              User,
              grade: await grade(req.params.UserId),
            })
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
  // Delete a User and remove them from the course
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.UserId })
      .then((User) =>
        !User
          ? res.status(404).json({ message: 'No such User exists' })
          : Course.findOneAndUpdate(
              { Users: req.params.UserId },
              { $pull: { Users: req.params.UserId } },
              { new: true }
            )
      )
      .then((course) =>
        !course
          ? res.status(404).json({
              message: 'User deleted, but no courses found',
            })
          : res.json({ message: 'User successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an Friend to a User
  addFriend(req, res) {
    console.log('You are adding an Friend');
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.UserId },
      { $addToSet: { friends: req.body } },
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
      { _id: req.params.UserId },
      { $pull: { friend: { friendId: req.params.friendId } } },
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
