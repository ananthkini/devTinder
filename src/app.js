const express = require("express");
const app = express();
const port = 7777;

// b is optional -- /ac ,  /abc
app.get('/ab?c',(req,res) => {
    res.send('Route Parameter with ?')
})

// any number of b -- /abbbbbbbbc
app.get('/ab+c',(req,res) => {
    res.send('Route Parameter with ?')
})


// start with ab and end with cd -- /abcd , /abjjghfhghicd
app.get('/ab*cd',(req,res) => {
    res.send('Route Parameter with ?')
})

// bc is optional
app.get('/a(bc)d',(req,res) => {
    res.send('Route Parameter with ()')
})

app.get("/user", (req, res) =>
  res.send({ fistname: "Ananth", lastname: "Kini" })
);

app.post("/user", (req, res) => {
  res.send("User Date saved succesfully");
});

app.delete("/user", (req, res) => {
  res.send("User data deleted");
});

app.put('/user',(req,res) => {
    res.send('User data updated')
})

app.patch('/user',(req,res) => {
    res.send('User data patched ')
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
