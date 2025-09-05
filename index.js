const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello Hostel Booking Site!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

 app.get("/rooms", (req, res) => {
  res.send("Room details will be shown here!");
});

app.use(express.static("public"));
