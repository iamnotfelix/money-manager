import { Category } from "./Category";
import { User } from "./User";

export interface Expense {
    id: string;
    amount: number;
    paymentType: string;
    description: string;
    currency: string;
    userId: string;
    user: User;
    date: Date;
    categories: Category[];

    // Calculated
    totalCategories: number;
}