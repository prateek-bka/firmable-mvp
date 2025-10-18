import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import abnRoutes from "./routes/abn/abnRoute.js";

const app = express();

app.use(
  cors({
    origin: config.frontendDomain,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Firmable MVP Backend!",
  });
});

app.use("/api/abn", abnRoutes);

app.use(globalErrorHandler);

export default app;
