import { Router } from "express";
import {
  getAllFilterOptions,
  getAllRecords,
  searchRecords,
  getRecordByAbn,
} from "../../controllers/abn/abnController.js";

export const abnRouter = Router();

// GET /api/abn/get-all-filter-options?counts=true
abnRouter.get("/get-all-filter-options", getAllFilterOptions);

// GET /api/abn/search?q=insurance&status=ACT&state=NSW&sort=updated_desc&page=1&limit=20
abnRouter.get("/search", searchRecords);

// GET /api/abn?page=1&limit=20
abnRouter.get("/", getAllRecords);

// GET /api/abn/:abn
abnRouter.get("/:abn", getRecordByAbn);
