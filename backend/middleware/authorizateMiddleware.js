const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const authorize = (permissions) => {
  return asyncHandler(async (req, res, next) => {
    let token = "";

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!token) {
        res.status(403);
        throw new Error("Forbidden");
      }

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      if (!permissions) {
        res.status(403);
        throw new Error("Forbidden");
      }

      if (
        permissions.includes("userDelete") &&
        req.user._id.toString() === req.query.id
      ) {
        res.status(400);
        throw new Error("You can't delete yourself");
      }

      const user = req.user;
      let userPermissions = new Set();

      for (const roleId of user.roles) {
        for (const permId of getValue(req.cache.roles, roleId).permissions) {
          const permName = getValue(req.cache.permissions, permId).name;
          if (!userPermissions.has(permName)) userPermissions.add(permName);
        }
      }

      for (const extraPermId of user.extraPerms) {
        const permName = getValue(req.cache.permissions, extraPermId).name;
        if (!userPermissions.has(permName)) userPermissions.add(permName);
      }

      if (
        userPermissions.has(permissions) ||
        (Array.isArray(permissions) &&
          permissions.every((p) => userPermissions.has(p)))
      ) {
        next();
      } else {
        res.status(403);
        throw new Error("Forbidden");
      }
    }
  });
};

function getValue(array, id) {
  return array.filter((value) => value._id.equals(id))[0];
}

module.exports = { authorize };
