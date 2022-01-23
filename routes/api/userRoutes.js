const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../../controllers/UserController.js');

// /api/Users
router.route('/').get(getUsers).post(createUser);

// /api/Users/:userId
router.route('/:userId').get(getSingleUser) 
.put(updateUser)
.delete(deleteUser);

// /api/Users/:userId/friends
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;
