import { Category } from "./Category";
import { Expense } from "./Expense";

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    expenses: Expense[];
    categories: Category[];
}