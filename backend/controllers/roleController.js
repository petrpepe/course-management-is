const asyncHandler = require("express-async-handler");
const Role = require("../models/roleModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

/**
 * @desc Get Roles
 * @route GET /api/Roles
 * @access Private
 */
const getRoles = asyncHandler(async (req, res) => {
  let arg = {};
  if (req.query.id) {
    const ids = Array.isArray(req.query.id)
      ? req.query.id.map((id) => new mongoose.Types.ObjectId(id))
      : req.query.id.split(",").map((id) => new mongoose.Types.ObjectId(id));
    arg = { ...arg, _id: { $in: ids } };
  }

  const Roles = await Role.find(arg);

  res.status(200).json(Roles);
});

/**
 * @desc Create role
 * @route POST /api/role
 * @access Private
 */
const setRole = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("Please add name");
  }

  const role = await Role.create(req.body);

  res.status(200).json(role);
});

/**
 * @desc Update role by id
 * @route PUT /api/roles/:id
 * @access Private
 */
const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    res.status(400);
    throw new Error("Role not find");
  }

  const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedRole);
});

/**
 * @desc Delete role by id
 * @route DELETE /api/roles/:id
 * @access Private
 */
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    res.status(400);
    throw new Error("Role not find");
  }

  await User.updateMany(
    { roles: role._id },
    { $pull: { roles: role._id } },
    { multi: true }
  );

  await role.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getRoles,
  setRole,
  updateRole,
  deleteRole,
};
