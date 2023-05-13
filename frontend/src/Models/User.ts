import { Category } from "./Category";
import { Expense } from "./Expense";
import { UserProfile } from "./UserProfile";

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    roles: string;
    userProfile: UserProfile;
    expenses: Expense[];
    categories: Category[];

    // Calculated
    totalSpent: number;
}