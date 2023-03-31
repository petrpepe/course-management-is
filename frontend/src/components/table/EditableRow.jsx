import { useState } from "react";

function EditableRow({ role, setEdit, handleCancelClick, }) {
  const [rowState, setRow] = useState({...role})
  
  const onChange = e => {
    const inputName = e.target.name

    setRow({
      ...rowState,
      [inputName]: e.target.value
    })

    setEdit({
      id: rowState._id,
      isEdited: true,
      name: rowState.name,
      description: rowState.description,
      permissions: rowState.permissions,
      [inputName]: e.target.value
    })
  }

  return (
    <>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter a name..."
          name="name"
          value={rowState.name}
          onChange={onChange}
        />
      </td>
      <td>
        <input
          type="text"
          required="required"
          placeholder="Enter an description..."
          name="description"
          value={rowState.description}
          onChange={onChange}
        />
      </td>
      <td>
        <input
          type="text"
          placeholder="Select permissions..."
          name="permissions"
          value={rowState.permissions}
          onChange={onChange}
        />
      </td>
      <td>
        <button type="submit">Save</button>
        <button type="button" onClick={() => handleCancelClick()}>
          Cancel
        </button>
      </td>
    </>
  );
};

export default EditableRow;