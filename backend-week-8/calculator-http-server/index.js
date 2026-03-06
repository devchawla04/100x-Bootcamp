const express = require("express");

const app = express();

app.use(express.json())

let reqCount = 0;

function middleware(req,res,next){
    reqCount++;
    next();
}

app.use(middleware);


app.get("/",function(req,res){
    res.sendFile('/Users/chawla/Documents/Harkirat 100x Bootcamp/backend-week-8/index.html')
})

app.get("/sum", function (req, res) {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  const sum = a + b;
  res.json({ ans: sum });
});
app.get("/sub", function (req, res) {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  const sub = a - b;
  res.json({ ans: sub });
});
app.get("/mul/:a/:b", function (req, res) {
  const a = parseInt(req.params.a);
  const b = parseInt(req.params.b);

  const mul = a * b;
  res.json({ ans: mul });
});
app.get("/div", function (req, res) {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  const div = a / b;
  res.json({ ans: div });
});

app.get("/reqCount", function (req, res) {
  res.send(reqCount);
});


app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
