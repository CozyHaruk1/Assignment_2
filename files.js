const fs = require("fs/promises");

const main = async () => {
  try {
    await fs.writeFile("notes.txt", "Hello from Node.js file system!\n");

    await fs.appendFile("notes.txt", "This line was added using appendFile.\n");

    const text = await fs.readFile("notes.txt", "utf-8");

    console.log("File content:");
    console.log(text);
  } catch (err) {
    console.error("File error:", err.message);
  }
};

main();
