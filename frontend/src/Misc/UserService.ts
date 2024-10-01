import { ApiService } from "./ApiService";
import URLConsts from "./URLConsts";
import { UserModel } from "./UserModel";

export class UserService {
    public static async GetUsers() {
        const response = await ApiService.GET(URLConsts.USERS_API);
        return response ? response : [];
    }

    public static async AddUser(user: UserModel) {
        return await ApiService.POST(URLConsts.USERS_API, user);
    }

    public static async UpdateUser(user: UserModel) {
        return await ApiService.PATCH(URLConsts.USERS_API, user);
    }

    public static async DeleteUser(userId: number) {
        return await ApiService.DELETE(URLConsts.USERS_API + '?userId=' + userId);
    }

    public static async DeleteUsers(markedUsers: number[]) {
        return await ApiService.DELETE(URLConsts.USERS_API + '?userId=' + markedUsers.join(','));
    }
}