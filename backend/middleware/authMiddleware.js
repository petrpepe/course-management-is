const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const Provider = require("../models/providerModel");
const Enrollment = require("../models/enrollmentModel");
const Class = require("../models/classModel");
const Course = require("../models/courseModel");
const mongoose = require("mongoose");

let cache = { roles: [], permissions: [] };

const authenticate = asyncHandler(async (req, res, next) => {
  let token = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //try {
    token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    await populateCache();

    req.userRoles = req.user.roles.map(
      (userRole) =>
        cache.roles.filter((cacheRole) => cacheRole._id.equals(userRole))[0]
          .name
    );

    req.userClasses = await Enrollment.find({
      students: req.user._id,
    }).select("classId");

    const classesLector = await Class.find({
      lectors: req.user._id,
    }).select("_id");

    req.userClasses = req.userClasses
      .map((c) => new mongoose.Types.ObjectId(c.classId))
      .concat(classesLector.map((c) => new mongoose.Types.ObjectId(c._id)));
    req.userCourses = await Course.find({
      $or: [
        { _id: { $in: req.userClasses } },
        { owner: { $in: req.user.provider } },
      ],
    });

    const providerIds = req.userCourses
      .map((c) => c.owner)
      .concat(req.user.provider);

    if (providerIds.length > 0)
      req.userProvider = await Provider.find({ _id: { $in: providerIds } });

    next();
    /*} catch (error) {
      res.status(401);
      throw new Error("Unauthorized");
    }*/
  }

  if (!token) {
    res.status(401);
    throw new Error("Unauthorized");
  }
});

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
        for (const permId of getValue(cache.roles, roleId).permissions) {
          const permName = getValue(cache.permissions, permId).name;
          if (!userPermissions.has(permName)) userPermissions.add(permName);
        }
      }

      for (const extraPermId of user.extraPerms) {
        const permName = getValue(cache.permissions, extraPermId).name;
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

async function populateCache() {
  await Role.find({})
    .select("_id name permissions")
    .then((roles) => {
      cache.roles = roles;
    })
    .catch((e) => {
      throw new Error(e);
    });

  await Permission.find({})
    .select("_id name")
    .then((permissions) => {
      cache.permissions = permissions;
    })
    .catch((e) => {
      throw new Error(e);
    });
}

function getValue(array, id) {
  return array.filter((value) => value._id.equals(id))[0];
}

module.exports = { authenticate, authorize };
