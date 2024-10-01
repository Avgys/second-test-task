import { ChangeEvent, useState } from "react";
import { Keys, UserModel } from "../Misc/UserModel";
import { excludeProps } from "./UserList";
import { useForm } from "react-hook-form";

export function EditableUserLine({ UserData, onDelete, onSave }
    : { UserData: UserModel, onDelete: (user: UserModel) => void, onSave: (user: UserModel) => void, editMode: boolean }) {

    const [isChanged, setChanged] = useState<boolean>(false);
    const [showDelete, setShowDelete] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserModel>({
        defaultValues: { ...UserData }
    });

    const keys = Keys(UserData);

    const fields = keys.map(fieldKey => {
        if (excludeProps.includes(fieldKey))
            return;

        const { onChange, onBlur, name, ref } = register(fieldKey, {
            required: fieldKey + ' is required',
            ...props[fieldKey]?.constraint,
        });

        const value = UserData[fieldKey] as string;

        if (props[fieldKey]?.type == 'select') {
            return <td key={fieldKey} >
                <select name={name} defaultValue={value} onChange={(e) => { onChange(e); setChanged(true); }} ref={ref} onBlur={onBlur}>
                    {props[fieldKey].values.map((x: any) => <option key={x} value={x}>{x}</option>)}
                </select>
            </td>
        }

        return <td key={fieldKey}>
            <input key={fieldKey} name={name} type={props[fieldKey]?.type} defaultValue={value} placeholder={fieldKey}
                onChange={(e) => { onChange(e); setChanged(true); }} ref={ref} />

            {props[fieldKey]?.postfix && <span>{' ' + props[fieldKey].postfix}</span>}
            {errors[fieldKey] && <p>{errors[fieldKey]?.message}</p>}
        </td>
    });

    function onSubmit(data: UserModel) {
        let minimizedData: any = {
            id: UserData.id
        };

        Keys(UserData).map(x => {
            if (UserData[x] !== data[x])
                minimizedData[x] = data[x];
        });

        onSave(minimizedData);
        setChanged(false);
        console.log(minimizedData);
    }

    function onInvalid(data: any) {
        console.log(data);
    }

    const hasErrors = Object.keys(errors).length > 0;

    const additionalButtons = (
        <>
            <button disabled={hasErrors} onClick={handleSubmit(onSubmit, onInvalid)}>Save</button>
            <button onClick={() => {
                reset(UserData);
                setChanged(false);
            }}>Reset</button>
        </>);

    const deleteButtons = !showDelete
        ? <button onClick={() => setShowDelete(true)}>Delete</button>
        : (<>
            <button onClick={() => onDelete(UserData)}>Confirm</button>
            <button onClick={() => setShowDelete(false)}>Not</button>
        </>)


    return (
        <>
            {fields}
            <td className="buttons-column">
                {isChanged && additionalButtons}
                {deleteButtons}
            </td>
        </>
    )
}

const props: { [id: string]: any; } = {
    age: {
        type: 'number',
        constraint: {
            min: {
                value: 18,
                message: 'Age must be at least 18',
            },
            max: {
                value: 100,
                message: 'Age must be at most 100',
            },
            valueAsNumber: true
        },
        postfix: 'years'
    },
    sex: {
        type: 'select',
        values: ['Man', 'Woman', 'Non']
    }
}

export const freshUserId = null;