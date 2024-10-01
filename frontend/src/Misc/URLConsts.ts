export default abstract class URLConsts{
    public static BACKEND_URL = 'https://localhost:44325';

    public static CONTROLLER_API = this.BACKEND_URL + '/api/admin';
    public static USERS_API = this.CONTROLLER_API + '/Users'
}