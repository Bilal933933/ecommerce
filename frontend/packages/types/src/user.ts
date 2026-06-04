export type IUser = {
    id: number;
    name: string;
    email: string;
    password?: string;
    role?: "admin" | "user" | "guest";
    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateUserInput = {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "user" | "guest";
}

export type IUserResponse = {
    id: string;
    name: string;
    email: string;
    role?: "admin" | "user" | "guest";
    createdAt?: Date;
    updatedAt?: Date;
}