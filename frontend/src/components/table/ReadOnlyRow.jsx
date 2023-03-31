import {useDispatch} from "react-redux"
import { deleteRole } from "../../features/roles/roleSlice";

function ReadOnlyRow({ role, handleEditClick }) {
  const dispatch = useDispatch()

  return (
    <>
      <td>{role.name}</td>
      <td>{role.description}</td>
      <td>{role.permissions}</td>
      <td>
        <button type="button" onClick={() => handleEditClick(role._id)} >
          Edit
        </button>
        <button type="button" onClick={() => dispatch(deleteRole(role._id))}>
          Delete
        </button>
      </td>
    </>
  );
};

export default ReadOnlyRow;