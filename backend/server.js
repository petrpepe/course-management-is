const path = require("path");
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

connectDB();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  optionsSuccessStatus: 200,
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(corsOptions));

app.use("/api/providers", require("./routes/providerRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/classes", require("./routes/classRoutes"));
app.use("/api/lessons", require("./routes/lessonRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/attendances", require("./routes/attendanceRoutes"));
app.use("/api/permissions", require("./routes/permissionRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/timetables", require("./routes/timetableRoutes"));
app.use("/api/sendemail", require("./routes/emailRoutes"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "..", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
