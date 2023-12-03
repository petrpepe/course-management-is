async function getAttendancesParams(params) {
  if (id && id.length > 0) {
    const ids = Array.isArray(id)
      ? id.map((id) => new mongoose.Types.ObjectId(id))
      : id.split(",").map((id) => new mongoose.Types.ObjectId(id));
    const enrollments = await Enrollment.find({ students: { $in: ids } });
    const timetables = await Timetable.find({
      classId: { $in: ids.concat(enrollments.map((e) => e.classId)) },
    });
    arg = {
      $or: [
        { timetableId: { $in: timetables.map((t) => t._id).concat(ids) } },
        { userId: { $in: ids } },
        { _id: { $in: ids } },
      ],
    };
  }

  if (startDatetime && endDatetime) {
    const start = new Date(startDatetime);
    const end = new Date(endDatetime);
    arg = {
      ...arg,
      datetime: { $gte: start.toISOString(), $lte: end.toISOString() },
    };
  }
}
