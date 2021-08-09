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

// :method :url :status :res[content-length] - :response-time ms
app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :body")
);

/**
 *
 * Middleware description
 * So essentially all middle ware functions are added on to a stack
 * When we call the next function regularly it continues to the next middleware in the stack
 * When we call next(error) it passes exclusively to the next error handling functions eventually hitting
 * the default handler
 */
const errorHandler = (error, request, response, next) => {
  console.log("error handler function");
  console.error(`error.message contents: ${error.message}`);
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
      console.log("get id error");
      next(error);
    });
});

app.get("/api/info", (request, response) => {
  Person.count({}).then((count) => {
    response.set("Content-Type", "text/html");
    response.send(Buffer.from(`<p>${count}</p><p>${Date()}</p>`));
  });
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

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
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
