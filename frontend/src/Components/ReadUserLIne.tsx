import { Config } from "../Misc/Config";
import { Keys, UserModel } from "../Misc/UserModel";
import { excludeProps } from "./UserList";

export function ReadUserLine({ UserData, config }: { UserData: UserModel, config: Config[] }): JSX.Element {

    console.log(config);

    const fields = config.map(field =>
        <td key={field.Name}>
            <span>{field.Keys.map(key => UserData[key as keyof UserModel]).join(' ')}</span>
        </td>
    );

    return <>{fields}</>;
}