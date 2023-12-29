app.get("/", function (req, res) {
  Item.find({})
    .then((documents) => {
      res.render("lists", { listTitle: "Today", newListItems: documents });
    })
    .catch((err) => {
      console.log(err);
    });
});
