import { Request, Response, NextFunction } from 'express';
export interface AdminAuthRequest extends Request {
    isAdmin?: boolean;
}
export declare const adminAuth: (req: AdminAuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
