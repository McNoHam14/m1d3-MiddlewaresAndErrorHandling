// CRUD endpoints

import Express from "express";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";

const blogPostsRouter = Express.Router();

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

// POST (new blog post)

blogPostsRouter.post("/", (req, res) => {
  // res.send({ message: "I am the blogPosts POST endpoint" });
  console.log("E", req.body);
  const newBlogPost = {
    ...req.body,
    createdAt: new Date(),
    id: uniqid(),
  };

  const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsJSONPath));

  blogPostsArray.push(newBlogPost);

  console.log("E", newBlogPost);

  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));

  res.status(201).send({ id: newBlogPost.id });
});

// GET (all blogPosts)

blogPostsRouter.get("/", (req, res) => {
  const fileContentAsBuffer = fs.readFileSync(blogPostsJSONPath);
  console.log("F", fileContentAsBuffer);

  console.log("G", JSON.parse(fileContentAsBuffer));
  const blogPostsArray = JSON.parse(fileContentAsBuffer);

  res.send(blogPostsArray);
});

// GET (single blogPost)

blogPostsRouter.get("/:blogPostId", (req, res) => {
  //   res.send({ message: "Single blogPost endpoint" });

  //   console.log("ID:", req.params.blogPostId);

  const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsJSONPath));

  const blogPost = blogPostsArray.find(
    (blogPost) => blogPost.id === req.params.blogPostId
  );

  console.log(blogPost);

  res.send(blogPost);
});

// PUT

blogPostsRouter.put("/:blogPostId", (req, res) => {
  const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsJSONPath));

  const index = blogPostsArray.findIndex(
    (blogPost) => blogPost.id === req.params.blogPostId
  );

  const oldBlogPost = blogPostsArray[index];

  const updatedBlogPost = {
    ...oldBlogPost,
    ...req.body,
    updatedAt: new Date(),
  };

  blogPostsArray[index] = updatedBlogPost;

  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));

  res.send(updatedBlogPost);
});

// DELETE

blogPostsRouter.delete("/:blogPostId", (req, res) => {
  const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsJSONPath));

  const remainingBlogPosts = blogPostsArray.filter(
    (blogPost) => blogPost.id !== req.params.blogPostId
  );

  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(remainingBlogPosts));

  res.status(204).send();
});

export default blogPostsRouter;
