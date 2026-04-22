import express from "express";
import genl_routes from "./router/general.ts";
import admin_routes from "./router/admin.ts";

const app = express();

app.use(express.json());


app.use("/home", genl_routes)
app.use("/home/admin", admin_routes)



const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
