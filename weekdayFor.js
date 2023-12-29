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
