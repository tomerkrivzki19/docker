const User = require("../model/User");

async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server err", error: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    console.log(req.params.id);

    if (!user) {
      res.status(404).json({ message: "The user have not been founded" });
    }

    console.log(user);
  } catch (error) {
    console.log("err", error);

    res
      .status(500)
      .json({ message: "Internal server err", error: error.message });
  }
}

async function createUser(req, res) {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(400)
      .json({ message: "User creation failed", error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found for deletion" });
    }
    res
      .status(200)
      .json({ message: "The user have successfuly deleted", user: deleteUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server err", error: error.message });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
};
