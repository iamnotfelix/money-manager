import { User } from "./User";

export interface Income {
    id: string;
    name: string;
    amount: number;
    currency: string;
    comments: string;
    userId: string;
    user: User;

    // Calculated
    totalExpenses: number;
}