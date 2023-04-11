import { useState } from "react";
import Select from 'react-select'

function EditableRow({ role, setEdit, handleCancelClick, options }) {
  const [rowState, setRow] = useState({...role})

  const defaultOptions = options.filter(opt => role.permissions.includes(opt.value))

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

  const onSelectChange = (e, a) => {
    const selectName = a.name
    let selectedOptionsValues = e.map((opt) => (opt.value))

    setRow({
      ...rowState,
      [selectName]: selectedOptionsValues,
    })

    setEdit({
      id: rowState._id,
      isEdited: true,
      name: rowState.name,
      description: rowState.description,
      permissions: rowState.permissions,
      [selectName]: selectedOptionsValues
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
        <Select
          id="permissions"
          name="permissions"
          options={options}
          defaultValue={defaultOptions}
          onChange={onSelectChange}
          isMulti isSearchable
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