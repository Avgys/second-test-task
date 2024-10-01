import { Config } from "../Misc/Config";
import { Keys, UserModel } from "../Misc/UserModel";

export function ReadUserLine({ UserData, config }: { UserData: UserModel, config: Config[] }): JSX.Element {
    const fields = config.map(field =>
        <td key={field.Name}>
            <span>{field.Keys.map(key => UserData[key as keyof UserModel]).join(' ') + (field.Postfix !== undefined && ' ' + field.Postfix)}</span>
        </td>
    );

    return <>{fields}</>;
}