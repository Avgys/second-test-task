export interface UserModel{
    id: number | null;
    firstName?: string;
    lastName?: string;
    age?: number;
    sex?: string;
}

export function Keys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}