import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import genl_routes from "./router/general.ts";
import admin_routes from "./router/admin.ts";
import session from "express-session";
import { requireAuth } from "./middleware/auth.ts";

const app = express();

app.use(express.json());

// Set up session middleware
app.use(
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  }),
);

declare module "express-session" {
  interface SessionData {
    userName: string;
  }
}



// protected routes
app.use("/home/admin", requireAuth);

app.use("/home", genl_routes);
app.use("/home/admin", admin_routes);


const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
