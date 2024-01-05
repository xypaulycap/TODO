const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://imafidon001:ZUelbWQG4jUAlZ49@cluster0.jkpya45.mongodb.net/todolistDB");

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "welcome to  your todoList",
});

const item2 = new Item({
  name: "Hit the + Button to add new items",
});

const item3 = new Item({
  name: "<--- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({})
    .then((documents) => {
      if (documents.length === 0) {
        Item.insertMany(defaultItems)
          .then((result) => {
            console.log("Documents inserted successfully:", result);
          })
          .catch((error) => {
            console.error("Error inserting documents:", error);
          })
          res.redirect("/")
          .finally(() => {
            // Close the connection after the operation is complete
            // mongoose.connection.close();
          });
        
      } else {
        res.render("lists", { listTitle: "Today", newListItems: documents });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  // Check if the list already exists
  List.findOne({ name: customListName })
    .then((document) => {
      if (!document) {
        // Create a new list only if it doesn't exist
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        // Save the new list to the database
        list
          .save()
          .then(() => {
            res.redirect("/" + customListName);
          })
          .catch((error) => {
            console.error("Error saving new list:", error);
          });
      } else {
        res.render("lists", {
          listTitle: document.name,
          newListItems: document.items,
        });
      }
    })
    .catch((error) => {
      console.error("Error checking for list:", error);
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((document) => {
      document.items.push(item);
      document.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    // If the listName is "Today", delete the item globally
    Item.findByIdAndDelete(checkedItemId)
      .then((result) => {
        console.log("Document Deleted successfully:", result);
        //res.redirect("/");
      })
      .catch((error) => {
        console.error("Error Deleting documents:", error);
        //res.redirect("/");
      })
      res.redirect("/");
  } else {
    // If the listName is not "Today", delete the item from the specified list
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      { useFindAndModify: false }
    )
      .then((result) => {
        console.log("Document Deleted from list successfully:", result);
        res.redirect("/" + listName);
      })
      .catch((error) => {
        console.error("Error Deleting document from list:", error);
        res.redirect("/" + listName);
      });
  }
});


app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("server running on port 3000");
});
