import {useDispatch} from "react-redux"

function ReadOnlyRow({ data, handleEditClick, dataArray, deleteAction }) {
  const dispatch = useDispatch()
  let a = 1;
  return (
    <>
    {data.length <= 0 ? "" :
      <>
        {Object.values(data).map(value => {
          a++
          return typeof value === "object" || value === data._id || value === data.__v ? "" : <td key={a}>{value}</td>;}
        )}
        {dataArray && dataArray.length > 0 ? <td>{dataArray}</td> : <td></td>}
        <td>
          <button type="button" onClick={() => handleEditClick(data._id)} >
            Edit
          </button>
          <button type="button" onClick={() => dispatch(deleteAction(data._id))}>
            Delete
          </button>
        </td>
      </>
    }
    </>
  );
};

export default ReadOnlyRow;