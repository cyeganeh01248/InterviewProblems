import { User } from "./tools";

declare global {
    declare namespace Express {
        export interface Request {
            user?: User;
        }
    }
}
