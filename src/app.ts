import express from "express";
import routes from "./routes/index.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);

export default app;
