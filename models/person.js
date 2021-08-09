const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
  },
});

personSchema.plugin(uniqueValidator);

// const Person = mongoose.model("Person", personSchema);

// Person.schema.path("number").validate(function (value) {
//   return value.length >= 8;
// }, "Invalid number");
//
// const opts = { runValidators: true };
// Person.findByIdAndUpdate(request.params.id, response, opts, function (err) {
//   assert.equal(re.color.message,
//     'Invalid color');
// });
// // Person.findByIdAndUpdate(
// //   { runValidators: true, context: "query" },
// //   function (err) {
// //     return err;
// //   }
// // );

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
// module.exports = Person;
