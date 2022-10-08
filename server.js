const app = require("express")();
app.get("*", (req, res) => {
  res.sendFile(__dirname + req.path);
});
app.listen(8080);