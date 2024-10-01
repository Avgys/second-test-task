import { useEffect, useState } from "react";
import { UserService } from "../Misc/UserService";
import { Keys, UserModel } from "../Misc/UserModel";
import { freshUserId, EditableUserLine } from "./EditableUserLine";
import { ReadUserLine } from "./ReadUserLIne";
import { Config } from "../Misc/Config";

function UsersList({ height }: any) {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [markedUsers, setMarkedUsers] = useState<(number | null)[]>([])
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);

  useEffect(() => {
    UserService.GetUsers().then(response => setUsers(response));
  }, []);

  function AddNewLine(newUser: UserModel) {
    if (users.find(x => x.id == newUser.id))
      return;

    setUsers([...users, newUser]);
  }

  function RemoveLine(...userIds: (number | null)[]) {
    userIds.forEach(userId => {
      const index = users.findIndex(x => x.id == userId);
      if (index === -1)
        return;

      users.splice(index, 1);
    });

    setUsers([...users]);
  }

  function DeleteGroup() {
    if (markedUsers.length === 0)
      return;

    RemoveLine(...markedUsers)

    markUsers(false, freshUserId);

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
    setShowDelete(false);
    markUsers(false, userData.id);

    if (userData.id != freshUserId)
      UserService.DeleteUser(userData.id);
  }

  function markUsers(isCheck: boolean, ...userIds: (number | null)[]) {

    userIds.forEach(userId => {
      const index = markedUsers.findIndex(x => x === userId);
      console.log('Called');

      if (isCheck) {
        if (index !== -1)
          return;

        markedUsers.push(userId);
      }
      else {
        if (index === -1)
          return;

        markedUsers.splice(index, 1);
      }
    });

    setMarkedUsers([...markedUsers]);
    setShowDelete(false);
  }

  let list = null;

  if (users.length != 0) {

    const keys = Keys(users[0]);
    const tableHeaders = !isEditing
      ? viewConfig.map(x => <th key={x.Name}>{x.Name}</th>)
      : <><th></th>{keys.map(x => !excludeProps.includes(x) && <th key={x}>{x.toUpperCase()}</th>)}</>

    const usersInfo = users
      .sort((a, b) => (a.id == null ? Number.MAX_VALUE : 0) + (a.id! - b.id!))
      .map((x) => <tr key={x.id}>
        {isEditing
          ? <>
            <td>
              <input type="checkbox" name="mark" style={{ margin: '1px' }} onChange={(e) => markUsers(e.target.checked, x.id)} checked={markedUsers.includes(x.id)} />
            </td>
            <EditableUserLine editMode={isEditing} UserData={x} onDelete={deleteUser} onSave={saveUser} />
          </>
          : <ReadUserLine config={viewConfig} UserData={x} />
        }
      </tr>)

    list = <>
      <div className="table-container" style={{ maxHeight: height }}>
        <table className="scrollable-table">
          <thead>
            <tr>
              {tableHeaders}
              <th />
            </tr>
          </thead>
          <tbody>
            {usersInfo}
          </tbody>
        </table>
      </div>
    </>;

  }
  else {
    list = <tr><td>NoUsers</td></tr>;
  }

  const deleteButtons = !showDelete
    ? <button onClick={() => setShowDelete(true)}>Delete checked</button>
    : (<>
      <button onClick={() => {
        DeleteGroup();
        setShowDelete(false)
      }}>Confirm</button>
      <button onClick={() => setShowDelete(false)}>Not</button>
    </>)

  let buttons = null;

  if (isEditing) {
    buttons = <>
      {!users.find(x => x.id == freshUserId) && <button onClick={() => AddNewLine(empty)}>Add</button>}
      {users.length != 0 && <>
        {deleteButtons}
        <button onClick={() => {
          setMarkedUsers(users.map(x => x.id));
          setShowDelete(false);
        }}>Check all</button>
        <button onClick={() => {
          setMarkedUsers([]);
          setShowDelete(false);
        }}>Uncheck</button>
      </>
      }
      <button onClick={() => setIsEditing(false)}>Stop editing</button>
    </>
  }
  else {
    buttons = <button onClick={() => setIsEditing(true)}>Edit table</button>
  }

  return <div className="user-list">
    {list}
    <div>
      {buttons}
    </div>
  </div>;
}

const viewConfig: Config[] = [
  {
    Name: "Name",
    Keys: ['firstName', 'lastName']
  },
  {
    Name: "Age",
    Keys: ['age'],
    Postfix: 'years'
  },
  {
    Name: "Sex",
    Keys: ['sex']
  },
]

const empty: UserModel = {
  id: freshUserId,
  firstName: '',
  lastName: '',
  age: 18,
  sex: 'Non'
};

export const excludeProps: (keyof UserModel)[] = ['id'];

export default UsersList;