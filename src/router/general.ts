import express from "express";
import articlesList from "../../data/articles.json" with { type: "json" };

const public_users = express.Router();

// get all articles
public_users.get("/", (req, res) => {
  return res.json(articlesList);
});

// get article with ID
public_users.get("/articles/:id", (req, res) => {
  const id = Number(req.params["id"]);
  articlesList.forEach((ele) => {
    console.log(ele.id, id);
    if (ele.id === id) {
      console.log(ele);
      return res.send(ele);
    }
  });
  return res.status(404).send(`Article with ID "${id}" not found`);
});


export default public_users