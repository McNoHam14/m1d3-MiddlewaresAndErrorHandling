// CRUD endpoints

import Express from "express";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";

const authorsRouter = Express.Router();

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
console.log(
  "TARGET:",
  join(dirname(fileURLToPath(import.meta.url)), "authors.json")
);

// POST (new author)

authorsRouter.post("/", (req, res) => {
  res.send({ message: "Hello I am the POST endpoint" });
  console.log("A", req.body);
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  authorsArray.push(newAuthor);

  console.log("B", newAuthor);

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  res.status(201).send({ id: newAuthor.id });
});

// GET (all authors)

authorsRouter.get("/", (req, res) => {
  const fileContentAsBuffer = fs.readFileSync(authorsJSONPath);
  console.log("C", fileContentAsBuffer);

  console.log("D", JSON.parse(fileContentAsBuffer));
  const authorsArray = JSON.parse(fileContentAsBuffer);

  res.send(authorsArray);
});

// GET (single author)

authorsRouter.get("/:authorId", (req, res) => {
  //   res.send({ message: "Single author endpoint " });

  //   console.log("ID:", req.params.userId);

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const author = authorsArray.find(
    (author) => author.id === req.params.authorId
  );

  console.log(author);

  res.send(author);
});

authorsRouter.put("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const index = authorsArray.findIndex(
    (author) => author.id === req.params.authorId
  );

  const oldAuthor = authorsArray[index];

  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };

  authorsArray[index] = updatedAuthor;

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  res.send(updatedAuthor);
});

authorsRouter.delete("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  );

  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));

  res.status(204).send();
});

authorsRouter.post("/checkEmail", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const emailInUse = authorsArray.some(
    (author) => author.email === req.body.email
  );

  console.log("A", emailInUse);

  res.send(
    `This email: ${req.body.email} is already is use (bool:${emailInUse})`
  );
});

export default authorsRouter;
