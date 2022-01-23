const { Thought,User, Reaction } = require('../models');

module.exports = {
  // Get all Thoughts
  getThoughts(req, res) {
    Thought.find({})
      .then((ThoughtData) => res.json(ThoughtData))
      .catch((err) => res.status(500).json(err));
  },
  // Get a Thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((ThoughtData) =>
        !ThoughtData
          ? res.status(404).json({ message: 'No Thought with that ID' })
          : res.json(ThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a Thought
 createThought(req, res) {
    Thought.create(req.body)
      .then((Thought) => {
       return User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: Thought._id } },
            { new: true }
          );
        })
        .then((userData) =>
        !userData
        ? res.status(404).json({ message: 'No Thought with that ID' })
        : res.json(userData)
        )      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a Thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((Thought) =>
        !Thought
          ? res.status(404).json({ message: 'No Thought with that ID' })
          : Student.deleteMany({ _id: { $in: Thought.students } })
      )
      .then(() => res.json({ message: 'Thought and reactions deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a Thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { new: true }
    )
      .then((Thought) =>
        !Thought
          ? res.status(404).json({ message: 'No Thought with this id!' })
          : res.json(Thought)
      )
      .catch((err) => res.status(500).json(err));
  },
// Add a Reaction to a Thought
addReaction(req, res) {
  console.log('You are adding a reaction');
  console.log(req.body);
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body } },
    { runValidators: true, new: true }
  )
    .then((Thought) =>
      !Thought
        ? res
            .status(404)
            .json({ message: 'No Thought found with that ID :(' })
        : res.json(Thought)
    )
    .catch((err) => res.status(500).json(err));
},
// Remove Reaction to a Thought
removeReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: req.body} },
    { runValidators: true, new: true }
  )
    .then((Thought) =>
      !Thought
        ? res
            .status(404)
            .json({ message: 'No Thought found with that ID :(' })
        : res.json(Thought)
    )
    .catch((err) => res.status(500).json(err));
},
};
