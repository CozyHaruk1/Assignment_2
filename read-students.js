const fs = require("fs/promises");
const path = require("path");

const main = async () => {
  try {
    const dataFile = path.join(__dirname, "data", "students.json");

    const text = await fs.readFile(dataFile, "utf-8");

    const students = JSON.parse(text);

    console.log(students);
  } catch (err) {
    console.error("File error:", err.message);
  }
};

main();
