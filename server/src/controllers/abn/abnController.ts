import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { abnModel } from "../../models/abnModel.js";
import { recordsLimit } from "../../constants/abnRecordsConstants.js";

// Get all filter options
export const getAllFilterOptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const includeCounts = req.query.counts === "true";

    const [states, statuses, gstStatuses, entityTypeDocs, postcodes] =
      await Promise.all([
        abnModel.distinct("businessAddress.state"),
        abnModel.distinct("status"),
        abnModel.distinct("gstStatus"),
        abnModel
          .aggregate([
            {
              $group: {
                _id: "$entityType.code",
                text: { $first: "$entityType.text" },
              },
            },
            { $match: { _id: { $ne: null } } },
            { $sort: { _id: 1 } },
          ])
          .exec(),
        abnModel.distinct("businessAddress.postcode"),
      ]);

    const entityTypes = entityTypeDocs.map((doc: any) => ({
      code: doc._id,
      text: doc.text || doc._id,
    }));

    let counts = {};
    if (includeCounts) {
      const [statusCounts, stateCounts, entityTypeCounts, gstStatusCounts] =
        await Promise.all([
          abnModel.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ]),
          abnModel.aggregate([
            { $group: { _id: "$businessAddress.state", count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } },
            { $sort: { _id: 1 } },
          ]),
          abnModel.aggregate([
            { $group: { _id: "$entityType.code", count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } },
            { $sort: { _id: 1 } },
          ]),
          abnModel.aggregate([
            { $group: { _id: "$gstStatus", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ]),
        ]);

      counts = {
        statuses: statusCounts.reduce(
          (acc: any, item: any) => ({
            ...acc,
            [item._id]: item.count,
          }),
          {},
        ),
        states: stateCounts.reduce(
          (acc: any, item: any) => ({
            ...acc,
            [item._id]: item.count,
          }),
          {},
        ),
        entityTypes: entityTypeCounts.reduce(
          (acc: any, item: any) => ({
            ...acc,
            [item._id]: item.count,
          }),
          {},
        ),
        gstStatuses: gstStatusCounts.reduce(
          (acc: any, item: any) => ({
            ...acc,
            [item._id]: item.count,
          }),
          {},
        ),
      };
    }

    const sortOptions = [
      { value: "name_asc", label: "Name (A-Z)" },
      { value: "name_desc", label: "Name (Z-A)" },
      { value: "abn_asc", label: "ABN (Low to High)", default: true },
      { value: "abn_desc", label: "ABN (High to Low)" },
      { value: "updated_desc", label: "Recently Updated" },
      { value: "updated_asc", label: "Oldest Updated" },
    ];

    const response: any = {
      success: true,
      data: {
        states: states.filter(Boolean).sort(),
        statuses: statuses.filter(Boolean).sort(),
        entityTypes,
        gstStatuses: gstStatuses.filter(Boolean).sort(),
        postcodes: postcodes
          .filter(Boolean)
          .sort((a: string, b: string) => a.localeCompare(b))
          .slice(0, 100),
        sortOptions,
      },
      message: "Filter options retrieved successfully",
    };

    if (includeCounts) {
      response.data.counts = counts;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "FETCH_ERROR",
        message: "Error fetching filter options",
      },
    });

    return next(
      createHttpError(
        500,
        `Error fetching filter options: ${(error as Error).message}`,
      ),
    );
  }
};

// Get all records (paginated)
export const getAllRecords = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
      },
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

    return next(
      createHttpError(
        500,
        `Error fetching records:! ${(error as Error).message}`,
      ),
    );
  }
};

// Search abn records with filters
export const searchRecords = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { q, name, status, state, abn, postcode, entityType, gst, sort } =
      req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const safeLimit = Math.min(limit, recordsLimit);

    const query: any = {};

    if (q) {
      const searchTerm = q as string;
      const trimmedSearch = searchTerm.trim();
      const isAbnSearch = /^\d+$/.test(trimmedSearch);

      if (isAbnSearch) {
        query.abn = { $regex: `^${trimmedSearch}`, $options: "i" };
      } else {
        query.$or = [
          { mainName: { $regex: trimmedSearch, $options: "i" } },
          { tradingNames: { $regex: trimmedSearch, $options: "i" } },
          { businessNames: { $regex: trimmedSearch, $options: "i" } },
          { otherNames: { $regex: trimmedSearch, $options: "i" } },
        ];
      }
    }

    if (name && !q) {
      query.$or = [
        { mainName: { $regex: name as string, $options: "i" } },
        { tradingNames: { $regex: name as string, $options: "i" } },
        { businessNames: { $regex: name as string, $options: "i" } },
        { otherNames: { $regex: name as string, $options: "i" } },
      ];
    }

    if (status) {
      query.status = (status as string).toUpperCase();
    }
    if (state) {
      query["businessAddress.state"] = (state as string).toUpperCase();
    }
    if (abn && !q) {
      query.abn = { $regex: `^${abn}`, $options: "i" };
    }
    if (postcode) {
      query["businessAddress.postcode"] = postcode as string;
    }
    if (entityType) {
      query["entityType.code"] = (entityType as string).toUpperCase();
    }
    if (gst) {
      query.gstStatus = (gst as string).toUpperCase();
    }

    let sortOption: any = { abn: 1 };
    if (sort === "name_asc") {
      sortOption = { mainName: 1 };
    } else if (sort === "name_desc") {
      sortOption = { mainName: -1 };
    } else if (sort === "abn_desc") {
      sortOption = { abn: -1 };
    } else if (sort === "updated_desc") {
      sortOption = { updatedAt: -1 };
    } else if (sort === "updated_asc") {
      sortOption = { updatedAt: 1 };
    }

    const result = await (abnModel as any).paginate(query, {
      page,
      limit: safeLimit,
      lean: true,
      sort: sortOption,
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
        filters: {
          q,
          name,
          status,
          state,
          abn,
          postcode,
          entityType,
          gst,
          sort,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching records",
    });

    return next(
      createHttpError(
        500,
        `Error searching records:! ${(error as Error).message}`,
      ),
    );
  }
};

// Get single record by ABN
export const getRecordByAbn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

    return next(
      createHttpError(
        500,
        `Error fetching details:! ${(error as Error).message}`,
      ),
    );
  }
};
