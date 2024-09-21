import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export interface Notification {
  _id: string;
  title: string;
  body: string;
}
