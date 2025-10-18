import { Router } from "express";
import {
  getAllFilterOptions,
  getAllRecords,
  searchRecords,
  getRecordByAbn,
} from "../../controllers/abn/abnController.js";

const router = Router();

// Get all filter options
router.get("/get-all-filter-options", getAllFilterOptions);

// Search abn records with filters
// GET /api/abn/search?name=insurance&status=ACT&state=NSW&page=1&limit=20
router.get("/search", searchRecords);

// Get all records (paginated), /api/abn?page=1&limit=20
router.get("/", getAllRecords);

// Get single record by ABN
// GET /api/abn/11059968651
router.get("/:abn", getRecordByAbn);

export default router;
