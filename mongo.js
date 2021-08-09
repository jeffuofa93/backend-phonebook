const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the arguments as : node mongo.js <password> <newPersonName> <newPersonNumber> or node mongo.js  <password> to see all phonebook entries"
  );
  process.exit(1);
}

const password = process.argv[2];
const databaseName = "phonebook-app";
const url = `mongodb+srv://jeff:${password}@phonebook-mongo.19wvo.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

switch (process.argv.length) {
  case 3:
    console.log("phonebook");
    Person.find({}).then((result) => {
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });
    break;
  case 5:
    const newPersonName = process.argv[3];
    const newPersonNumber = process.argv[4];

    const person = new Person({
      name: newPersonName,
      number: newPersonNumber,
    });

    person.save().then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      mongoose.connection.close();
    });
    break;

  default:
    console.log("input error try again");
}

//
// Person.find({ important: true }).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
