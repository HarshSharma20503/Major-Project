import { Request, Response, NextFunction } from "express";
import { AsyncHandler } from "../utils/AsyncHanlder.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import logger from "../utils/logger.js";

interface AuthenticatedRequest extends Request {
  user?: typeof User & { _id: string };
}

/*
/api/user/
GET Request
*/
const getUser = AsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    logger.debug("Inside the getUser function");
    if (!req.user) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    const user = await User.findById(req.user._id); // Assuming `req.user` is populated by a middleware
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user));
  }
);

/*
/api/user/addCompany
POST Request
*/
const addCompany = AsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    logger.debug("Inside the addCompany function");
    const { company, stockUnits }: { company: string; stockUnits: number } =
      req.body;

    if (!company || !stockUnits) {
      throw new ApiError(400, "Company and Stock units are required");
    }
    if (!req.user) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const index = user.companies.findIndex((item) => item.name === company);

    if (index !== -1) {
      throw new ApiError(400, "Company already exists");
    }

    user.companies.push({ name: company, quantity: stockUnits });
    await user.save();

    res.status(201).json(new ApiResponse(201, user));
  }
);

/*
/api/user/deleteCompanyStock
POST Request
*/
const removeStock = AsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    logger.debug("Inside the removeStock function");
    const { company }: { company: string } = req.body;
    if (!company) {
      throw new ApiError(400, "Company is required");
    }
    if (!req.user) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    user.companies = user.companies.filter((item) => item.name !== company);
    await user.save();
    res.status(200).json(new ApiResponse(200, user));
  }
);

/*
/api/user/updateCompanyStock
POST Request
*/
const updateCompanyStock = AsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    logger.debug("Inside the updateCompanyStock function");
    const { company, stockUnits }: { company: string; stockUnits: number } =
      req.body;
    if (!company || !stockUnits) {
      throw new ApiError(400, "Company and Stock units are required");
    }
    if (!req.user) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const index = user.companies.findIndex((item) => item.name === company);
    if (index === -1) {
      throw new ApiError(404, "Company not found");
    }
    user.companies[index].quantity = stockUnits;
    await user.save();
    res.status(200).json(new ApiResponse(200, user));
  }
);

export { getUser, addCompany, removeStock, updateCompanyStock };
