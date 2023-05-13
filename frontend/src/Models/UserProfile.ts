import { User } from "./User";

export interface UserProfile {
    id: string;
    name: string;
    status: string;
    bio: string;
    gender: string;
    birthday: Date;
    userId: string;
    user: User;
}