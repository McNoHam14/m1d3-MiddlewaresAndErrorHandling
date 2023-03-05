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

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));

const writeBlogPosts = (blogPostsArray) =>
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));

// POST (new blog post)

blogPostsRouter.post("/", (req, res) => {
  // res.send({ message: "I am the blogPosts POST endpoint" });
  console.log("E", req.body);
  const newBlogPost = {
    ...req.body,
    createdAt: new Date(),
    id: uniqid(),
  };

  const blogPostsArray = getBlogPosts();

  blogPostsArray.push(newBlogPost);

  console.log("E", newBlogPost);

  writeBlogPosts(blogPostsArray);

  res.status(201).send({ id: newBlogPost.id });
});

// GET (all blogPosts)

blogPostsRouter.get("/", (req, res) => {
  const fileContentAsBuffer = fs.readFileSync(blogPostsJSONPath);
  console.log("F", fileContentAsBuffer);

  console.log("G", JSON.parse(fileContentAsBuffer));
  const blogPostsArray = getBlogPosts();

  res.send(blogPostsArray);
});

// GET (single blogPost)

blogPostsRouter.get("/:blogPostId", (req, res) => {
  //   res.send({ message: "Single blogPost endpoint" });

  //   console.log("ID:", req.params.blogPostId);

  const blogPostsArray = getBlogPosts();

  const blogPost = blogPostsArray.find(
    (blogPost) => blogPost.id === req.params.blogPostId
  );

  console.log(blogPost);

  res.send(blogPost);
});

// PUT

blogPostsRouter.put("/:blogPostId", (req, res) => {
  const blogPostsArray = getBlogPosts();

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

  writeBlogPosts(blogPostsArray);

  res.send(updatedBlogPost);
});

// DELETE

blogPostsRouter.delete("/:blogPostId", (req, res) => {
  const blogPostsArray = getBlogPosts();

  const remainingBlogPosts = blogPostsArray.filter(
    (blogPost) => blogPost.id !== req.params.blogPostId
  );

  writeBlogPosts(blogPostsArray);

  res.status(204).send();
});

export default blogPostsRouter;
