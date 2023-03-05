import Express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";
import blogPostsRouter from "./api/blogPosts/index.js";

const server = Express();

const port = 3002;

// Endpoints

server.use(Express.json());

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on ${port}`);
});
