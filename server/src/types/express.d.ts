import { IUser } from '../models/User';

declare global {
    namespace Express {
        interface User {
            _id: string;
            coupleId: string;
            email: string;
            name: string;
        }

        interface Request {
            user?: User;
        }
    }
}
