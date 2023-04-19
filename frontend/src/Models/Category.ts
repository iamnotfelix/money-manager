import { User } from "./User";

export interface Category {
    id: string;
    name: string;
    description: string;
    userId: string;
    user: User;
}