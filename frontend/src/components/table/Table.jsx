import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { createRole, deleteRole, updateRole} from "../../features/roles/roleSlice"
import { getPermissions, reset } from "../../features/permissions/permissionSlice"
import ReadOnlyRow from "./ReadOnlyRow"
import EditableRow from "./EditableRow"
import Spinner from "../Spinner"
import Select from 'react-select'
import { toast } from "react-toastify"

function Table({roles}) {
  const dispatch = useDispatch()
  
  const [role, setState] = useState({name: "", description: "", permissions: []})
  const [editRole, setEdit] = useState({_id: "", ...role, isEdited: false})

  const { permissions, isLoading, isError, message } = useSelector((state) => state.permissions)

  const onSubmitAdd = e => {
    e.preventDefault()

    dispatch(createRole(role))
    setState({})
  }

  const onSubmitEdit = e => {
    e.preventDefault()

    dispatch(updateRole({_id: editRole._id, name: editRole.name, description: editRole.description, permissions: editRole.permissions ? editRole.permissions : []}))
    setEdit({_id: "",  role: {}, isEdited: false})
    setState({})
  }

  const handleEditClick = (id) => {
    console.log(id);
    setEdit({_id: id, role: role, isEdited: true})
  };

  const handleCancelClick = () => {
    setEdit({_id: "", role: {}, isEdited: false})
  };

  const onChange = e => {
    const inputName = e.target.name

    setState({
      ...role,
      [inputName]: e.target.value,
    })
  }

  const onSelectChange = e => {
    let selectedOptionsValues = [];

    for (let index = 0; index < e.length; index++) {
      selectedOptionsValues[index] = e[index].value
    }

    setState({
      ...role,
      permissions: selectedOptionsValues
    })
  }

  useEffect(() => {
    if(isError) {
      toast.error(message);
    }

    dispatch(getPermissions())

    return () => {
      dispatch(reset())
    }
  }, [isError, message, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  const options = permissions.map((permission) => ({value: permission._id, label: permission.name}))

  return (
    <div className="app-container">
      {roles.length > 0 ? (
        <form onSubmit={onSubmitEdit}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role._id}>
                  { editRole.isEdited && editRole._id === role._id ? (
                    <EditableRow
                      data={role}
                      setEdit={setEdit}
                      handleCancelClick={handleCancelClick}
                      options={options}
                    />
                  ) : (
                    <ReadOnlyRow
                      data={role}
                      handleEditClick={handleEditClick}
                      deleteAction={deleteRole}
                      dataArray={role.permissions.map(perm => {
                        const permName = options.filter(opt => perm === opt.value)
                        if(permName.length > 0) return permName[0].label
                        else return ""
                      })}
                    />
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      ) : ( 
        <h3>You haven't set any role</h3> 
      )}

      <h2>Add a Role</h2>
      <form onSubmit={onSubmitAdd}>
        <input
          type="text"
          name="name"
          required="required"
          placeholder="Enter a name..."
          onChange={onChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Enter an description..."
          onChange={onChange}
        />
        <Select name="permissions" options={options} onChange={onSelectChange} isMulti isSearchable />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Table;