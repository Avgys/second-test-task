import { useEffect, useState } from "react";
import { ApiService } from "../Misc/ApiService";
import { UserService } from "../Misc/UserService";
import { UserModel } from "../Misc/User";

function UsersList() {
  const [users, setUsers] = useState<UserModel[]>([]);

  useEffect(() => {
    UserService.GetUsers()
    .then(response => setUsers(response));
  }, []);

  const usersInfo = users.map(x => x)

  return (
    <div className="App">

    </div>
  );
}

export default UsersList;