namespace chat_backend.Validation
{
    public static class UserModelValidation
    {
        public static bool AddValid(UserModel model) 
            => (model.Age >= 18 && model.Age <= 100)
                && model.FirstName != null
                && model.LastName != null
                && model.Sex != null;
    }
}