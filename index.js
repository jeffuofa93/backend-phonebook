const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");
const morgan = require("morgan");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

morgan.token("body", (request) => JSON.stringify(request.body));
// morgan.token("error", (request) => JSON.stringify(request.body));
// :method :url :status :res[content-length] - :response-time ms
// app.use(morgan("tiny"));
app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :body")
);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  console.log("error handler function");
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) response.json(person);
      else response.status(404).end();
    })
    .catch((error) => {
      console.log("WAT IS THIS");
      next(error);
    });
});

app.get("/api/info", (request, response) => {
  const sizeString = `Phonebook has info for ${persons.length} people`;
  const date = Date();
  response.set("Content-Type", "text/html");
  response.send(Buffer.from(`<p>${sizeString}</p><p>${date}</p>`));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
