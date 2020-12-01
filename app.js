const express = require("express")
const bodyParser = require("body-parser")

const app =  express()
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

let items= ["Buy Food","Cook Food","Eat Food"];
let workitems =[]
let schoolitems = []

app.get('/',(req,res) =>{
  let today = new Date();
  let options = {
    weekday:"long",
    day:"numeric",
    month:"long"}
  let day = today.toLocaleDateString("en-US",options)
  res.render("index",{listTitle:day, newitems:items})
})

app.post('/', (req,res) =>{
console.log(req.body)
item = req.body.newItem
if(req.body.List === 'Work List'){
  workitems.push(item)
  res.redirect('/work')
}else if(req.body.List === 'School List'){
  schoolitems.push(item)
  res.redirect('/school')
}else{
  items.push(item);
  res.redirect('/')
}
})

app.get('/work',(req,res) => {
  res.render("index",{listTitle:"Work List", newitems:workitems})
})

app.get('/school',(req,res) => {
  res.render("index",{listTitle:"School List", newitems:schoolitems})
})

app.get('/about',(req,res) => {
  res.render("about")
})

app.listen(3000 , function(){
  console.log("Server Listening to port 3000")
})
