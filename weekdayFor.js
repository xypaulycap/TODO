const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let currentDay = 2; // Assuming currentDay is an integer between 0 and 6

let day;

for (let i = 0; i < daysOfWeek.length; i++) {
  if (currentDay === i) {
    day = daysOfWeek[i];
    break;
  }
}

console.log(day); // Outputs: Tuesday



app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  Item.findByIdAndDelete(checkedItemId)
    .then((result) => {
      console.log("Document Deleted successfully:", result);
    })
    .catch((error) => {
      console.error("Error Deleting documents:", error);
    });
  res.redirect("/");
});