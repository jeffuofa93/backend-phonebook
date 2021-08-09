require("dotenv").config();
const express = require("express");
const app = express();
const Person = require("./models/person");
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(express.static("build"));
app.use(cors());

morgan.token("body", function getId(request) {
  return JSON.stringify(request.body);
});
// :method :url :status :res[content-length] - :response-time ms
// app.use(morgan("tiny"));
app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Popdpendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.get("/api/info", (request, response) => {
  const sizeString = `Phonebook has info for ${persons.length} people`;
  const date = Date();
  response.set("Content-Type", "text/html");
  response.send(Buffer.from(`<p>${sizeString}</p><p>${date}</p>`));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

// app.post("/api/persons", (request, response) => {
//   const body = request.body;
//
//   const duplicateName = persons.find((person) =>
//     person.name.includes(body.name)
//   );
//
//   if (!body.name || !body.number) {
//     return response.status(400).json({
//       error: "name or number is missing",
//     });
//   }
//
//   if (duplicateName) {
//     return response.status(400).json({
//       error: "name must be unique",
//     });
//   }
//
//   const person = {
//     id: randomNumber(0, 100000),
//     name: body.name,
//     number: body.number,
//   };
//
//   persons = persons.concat(person);
//
//   response.json(person);
// });

app.post("/api/persons", (request, response) => {
  const body = request.body;
  // case where note doesn't have a content field
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number is missing" });
  }
  // Note is from the note.js and the noteShema
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  // save adds the element to the database and returns the result
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
