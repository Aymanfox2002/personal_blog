import fs from "fs/promises";
import path from "path";
import process from "process";

// get the path of articles.json file
const root = process.cwd();
export const articlesFile = path.join(root, "data", "articles.json");
export const usersFile = path.join(root, "data", "users.json");

// get all articles
export async function getArticles() {
  try {
    const data = await fs.readFile(articlesFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
  }
}

// get all users
export async function getUsers() {
  try {
    const data = await fs.readFile(usersFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
  }
}

// generate new ID for new article
export async function idGen() {
  try {
    const data = await getArticles();
    const id = data[data.length - 1].id + 1;
    console.log(id);
    return id;
  } catch (error) {
    return 0;
  }
}
