import { Router, type NextFunction, type Request, type Response } from "express";
import createHttpError from "http-errors";
import { abnModel } from "../../models/abnModel.js";
import { recordsLimit } from "../../constants/abnRecordsConstants.js";

const router = Router();

// Get all filter options
router.get("/get-all-filter-options", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all unique values for filter dropdowns
    const [states, statuses, entityTypes, gstStatuses] = await Promise.all([
      abnModel.distinct("businessAddress.state"),
      abnModel.distinct("status"),
      abnModel.distinct("entityType.code"),
      abnModel.distinct("gstStatus"),
    ]);

    res.status(200).json({
      success: true,
      data: {
        states: states.filter(Boolean).sort(),
        statuses: statuses.filter(Boolean).sort(),
        entityTypes: entityTypes.filter(Boolean).sort(),
        gstStatuses: gstStatuses.filter(Boolean).sort(),
      },
      message: "Filter options retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "FETCH_ERROR",
        message: "Error fetching filter options",
      },
    });

    return next(createHttpError(500, `Error fetching filter options: ${(error as Error).message}`));
  }
});

// Get all records (paginated), /api/abn?page=1&limit=20
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    // Ensure limit
    const safeLimit = Math.min(limit, recordsLimit);

    const result = await (abnModel as any).paginate(
      {},
      {
        page,
        limit: safeLimit,
        lean: true,
        sort: { createdAt: -1 },
      }
    );

    res.status(200).json({
      success: true,
      message: "Records retrieved successfully",
      data: {
        businesses: result.docs,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.totalDocs,
          pages: result.totalPages,
          hasNext: result.hasNextPage,
          hasPrev: result.hasPrevPage,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "FETCH_ERROR",
        message: "Error fetching records",
      },
    });

    return next(createHttpError(500, `Error fetching records:! ${(error as Error).message}`));
  }
});

// Search abn records with filters
// GET /api/abn/search?name=insurance&status=ACT&state=NSW&page=1&limit=20
router.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, status, state, abn, postcode, entityType, gst } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    // Ensure limit
    const safeLimit = Math.min(limit, recordsLimit);

    // Build query dynamically based on provided filters
    const query: any = {};

    if (name) {
      query.mainName = { $regex: name as string, $options: "i" };
    }
    if (status) {
      query.status = (status as string).toUpperCase();
    }
    if (state) {
      query["businessAddress.state"] = (state as string).toUpperCase();
    }
    if (abn) {
      query.abn = abn;
    }
    if (postcode) {
      query["businessAddress.postcode"] = postcode;
    }
    if (entityType) {
      query["entityType.code"] = (entityType as string).toUpperCase();
    }
    if (gst) {
      query.gstStatus = (gst as string).toUpperCase();
    }

    const result = await (abnModel as any).paginate(query, {
      page,
      limit: safeLimit,
      lean: true,
      sort: { mainName: 1 },
    });

    res.json({
      success: true,
      message: `Found ${result.totalDocs} matching record(s)`,
      data: {
        businesses: result.docs,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.totalDocs,
          pages: result.totalPages,
          hasNext: result.hasNextPage,
          hasPrev: result.hasPrevPage,
        },
        filters: query, // Return applied filters
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching records",
    });

    return next(createHttpError(500, `Error searching records:! ${(error as Error).message}`));
  }
});

// Get single record by ABN
// GET /api/abn/11059968651
router.get("/:abn", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { abn } = req.params;

    const business = await abnModel.findOne({ abn }).lean();

    if (!business) {
      return res.status(400).json({
        success: false,
        message: `Business with ABN ${abn} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: business,
      message: "Business details retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "FETCH_ERROR",
        message: "Error fetching details",
      },
    });

    return next(createHttpError(500, `Error fetching details:! ${(error as Error).message}`));
  }
});

export default router;
