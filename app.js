const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "welcome to  your todoList"
});

const item2 = new Item ({
  name: "Hit the + Button to add new items"
});

const item3 = new Item ({
  name: "<--- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];



app.get("/", function (req, res) {

  Item.find({})
  .then((documents) => {

    if (documents.length === 0) {
      Item.insertMany(defaultItems).then((result) => {
        console.log('Documents inserted successfully:', result);
      })
      .catch((error) => {
        console.error('Error inserting documents:', error);
      })
      .finally(() => {
        // Close the connection after the operation is complete
       // mongoose.connection.close();
      });
      res.redirect("/");
    } else {
      res.render("lists", { listTitle: "Today", newListItems: documents});
    }
  })
    .catch((err) => {
      console.log(err);
    });
    
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/")


});

app.get("/work", function (req, res) {
  res.render("lists", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("server running on port 3000");
});
