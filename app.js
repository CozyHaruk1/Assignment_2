const express = require("express");
const path = require("path");
const fs = require("fs/promises");

const app = express();
const PORT = 3000;

// Custom logger middleware
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
  );
  next();
});

// Parse JSON request bodies
app.use(express.json());

// EJS setup
app.set("view engine", "ejs");

// Store students
let students = [];

// Load students from JSON file
const loadStudents = async () => {
  const dataFile = path.join(__dirname, "data", "students.json");
  const text = await fs.readFile(dataFile, "utf-8");
  students = JSON.parse(text);
};

// Make students available to routes
app.use((req, res, next) => {
  req.students = students;
  next();
});

// Home
app.get("/", (req, res) => {
  res.send(`
    <h1>Student API</h1>
    <p>Welcome to the Student API Server.</p>

    <ul>
      <li><a href="/api/students">GET /api/students</a></li>
      <li><a href="/api/students/1">GET /api/students/:id</a></li>
      <li><a href="/api/count">GET /api/count</a></li>
      <li><a href="/api/students/random">GET /api/students/random</a></li>
      <li><a href="/students">GET /students</a></li>
    </ul>

    <p>POST /api/students must be tested using curl or an API testing tool.</p>
  `);
});

// Student API routes
const studentRoutes = require("./routes/students");

app.use("/api/students", studentRoutes);

// Count
app.get("/api/count", (req, res) => {
  res.json({
    count: students.length
  });
});

// Random student
app.get("/api/students/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * students.length);
  const randomStudent = students[randomIndex];

  res.json(randomStudent);
});

// POST new student
app.post("/api/students", (req, res) => {
  const student = req.body;

  students.push(student);

  res.status(201).json(student);
});

// Render students with EJS
app.get("/students", (req, res) => {
  res.render("students", {
    title: "All Students",
    students: students
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// Load data and start server
loadStudents()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to load students:", err.message);
  });