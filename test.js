const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const _ = require("lodash")

const app = express()
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const itemSchema = new mongoose.Schema({
  name: String
})

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})

const Item = mongoose.model("Item", itemSchema)
const List = mongoose.model("List", listSchema)

const item1 = new Item({
  name: "Welcome to to-do-list"
})
const item2 = new Item({
  name: "Hit the + button to add new item"
})
const item3 = new Item({
  name: "Check this box to delete any item"
})

const defaultItems = [item1, item2, item3]

// HOME PAGE
app.get('/', (req, res) => {
  Item.find({}, function(err, founditems) {
    if (founditems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Saved Successfully");
        }
      })
      res.redirect('/')
    } else {
      res.render("index", {listTitle:"Today",  newitems: founditems})
    }
  })
})

// DYNAMIC ROUTE
app.get('/:new', (req, res) => {
  const customListName = _.capitalize(req.params.new)
  List.findOne({name: customListName}, function(err,foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        })
          list.save();
          res.redirect('/'+customListName)
      } else {
        res.render("index", {listTitle:foundList.name, newitems: foundList.items})
      }
    }
  })
})

// ADD ITEMS TO THE SELECTED PAGE
app.post('/', (req, res) => {
  const itemName = req.body.newItem
  const listName = req.body.list

  const item = new Item({
    name: itemName
  });

  if (listName === "Today"){
    item.save()
    res.redirect('/')
  } else {
    List.findOne({name:listName}, function(err,foundList){
      foundList.items.push(item);
      foundList.save()
      res.redirect('/'+listName)
    })
  }
})

// TO DELETE THE CHECKED ITEMS FROM THE LIST
app.post('/delete', (req, res) => {
  deleteChecked = req.body.id;
  listName = req.body.listName;

  if(listName === "Today"){
    Item.deleteOne({_id: deleteChecked}, function(err) {
      if (!err) {
        res.redirect('/')
      }
    })
  } else{
    List.findOneAndUpdate({name:listName}, {$pull: {items: {_id:deleteChecked }}}, function(err,foundList){
      if(!err){
        res.redirect('/'+listName)
      }
    })
  }

})

app.listen(3000, function() {
  console.log("Server Listening to port 3000")
})
