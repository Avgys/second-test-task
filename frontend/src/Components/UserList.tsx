import { ChangeEvent, useEffect, useState } from "react";
import { UserService } from "../Misc/UserService";
import { Keys, UserModel } from "../Misc/UserModel";
import { freshUserId, EditableUserLine } from "./EditableUserLine";
import { userInfo } from "os";
import { inherits } from "util";
import { ReadUserLine } from "./ReadUserLIne";
import { Config } from "../Misc/Config";

function UsersList({ height }: any) {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [markedUsers, setMarkedUsers] = useState<(number | null)[]>([])
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    UserService.GetUsers().then(response => setUsers(response));
  }, []);

  function AddNewLine(newUser: UserModel) {
    if (users.find(x => x.id == newUser.id))
      return;

    setUsers([...users, newUser]);
  }

  function RemoveLine(userId: number | null) {
    const index = users.findIndex(x => x.id == userId);
    if (index === -1)
      return;

    users.splice(index, 1);
    setUsers([...users]);
  }

  function DeleteGroup() {
    if (markedUsers.length === 0)
      return;

    markedUsers.forEach(x => RemoveLine(x));

    const index = users.findIndex(x => x.id == freshUserId);

    if (index !== -1)
      markedUsers.splice(index, 1);

    UserService.DeleteUsers(markedUsers as number[]);
    setMarkedUsers([]);
  }

  function Replace(oldUser: UserModel, newUser: UserModel) {
    const index = users.findIndex(x => x.id == oldUser.id);
    if (index === -1)
      return;

    users.splice(index, 1);
    if (users.find(x => x.id == newUser.id))
      return;

    setUsers([...users, newUser]);
  }

  async function saveUser(userData: UserModel) {
    const newUser = await (userData.id == freshUserId ? UserService.AddUser(userData) : UserService.UpdateUser(userData));
    Replace(userData, newUser);
  }

  function deleteUser(userData: UserModel) {
    RemoveLine(userData.id);

    if (userData.id != freshUserId)
      UserService.DeleteUser(userData.id);
  }

  function markUser(userId: number | null, event: ChangeEvent<HTMLInputElement>) {
    const index = markedUsers.findIndex(x => x == userId);
    console.log('Called');

    if (event.target.checked) {
      if (index !== -1)
        return;

      setMarkedUsers([...markedUsers, userId])
    }
    else {
      if (index === -1)
        return;

      markedUsers.splice(index, 1);
      setMarkedUsers([...markedUsers])
    }
  }

  let usersInfo = null;
  let tableHeaders = null;

  if (users.length != 0) {
    usersInfo = users
      .sort((a, b) => (a.id == null ? Number.MAX_VALUE : 0) + (a.id! - b.id!))
      .map((x) => <tr key={x.id}>
        {isEditing
          ? <>
            <td>
              <input type="checkbox" name="mark" style={{ margin: '1px' }} onChange={(e) => markUser(x.id, e)} checked={markedUsers.includes(x.id)} />
            </td>
            <EditableUserLine editMode={isEditing} UserData={x} onDelete={deleteUser} onSave={saveUser} />
          </>
          : <ReadUserLine config={viewConfig} UserData={x} />
        }
      </tr>)

    const keys = Keys(users[0]);
    tableHeaders = keys.map(x => !excludeProps.includes(x) && <th key={x}>{x.toUpperCase()}</th>)
  }
  else {
    usersInfo = <tr><td>NoUsers</td></tr>;
  }

  const empty: UserModel = {
    id: freshUserId,
    firstName: '',
    lastName: '',
    age: 18,
    sex: 'Non'
  };

  const list = isEditing
    ? (<div className="user-list">
      <div className="table-container" style={{ maxHeight: height }}>
        <table className="scrollable-table">
          <thead>
            <tr>
              <th />
              {tableHeaders}
              <th />
            </tr>
          </thead>
          <tbody>
            {usersInfo}
          </tbody>
        </table>
      </div>
      <div>
        {!users.find(x => x.id == freshUserId) && <button onClick={() => AddNewLine(empty)}>Add</button>}
        <button onClick={DeleteGroup}>Delete checked</button>
        <button onClick={() => setMarkedUsers(users.map(x => x.id))}>Check all</button>
        <button onClick={() => setMarkedUsers([])}>Uncheck</button>
        <button onClick={() => setIsEditing(false)}>Stop editing</button>
      </div>
    </div>
    )
    : (<div className="user-list">
      <div className="table-container" style={{ maxHeight: height }}>
        <table className="scrollable-table">
          <thead>
            <tr>
              {viewConfig.map(x => <th key={x.Name}>{x.Name}</th>)}
            </tr>
          </thead>
          <tbody>
            {usersInfo}
          </tbody>
        </table>
      </div>
      <div>
        <button onClick={() => setIsEditing(true)}>Edit table</button>
      </div>
    </div>)

  return list;
}

const viewConfig: Config[] = [
  {
    Name: "Name",
    Keys: ['firstName', 'lastName']
  },
  {
    Name: "Age",
    Keys: ['age']
  },
  {
    Name: "Sex",
    Keys: ['sex']
  },
]

export const excludeProps: (keyof UserModel)[] = ['id'];

export default UsersList;