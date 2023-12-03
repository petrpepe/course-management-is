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
    try {
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

      req.cache = cache;

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Unauthorized");
  }
});

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

module.exports = { authenticate };
