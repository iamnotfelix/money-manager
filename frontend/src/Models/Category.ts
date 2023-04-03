import { User } from "./User";

export interface Category {
    id: string;
    name: string;
    description: string;
    user: User;
}