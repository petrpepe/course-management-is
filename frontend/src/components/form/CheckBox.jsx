import { useState } from "react"
import { updateAttendance } from "../../features/attendances/attendanceSlice"
import { useDispatch } from "react-redux"
import { TextField } from "@mui/material"

const CheckBox = ({ id, defaultValue, attId, userId }) => {
    const dispatch = useDispatch()

    const [checked, setChecked] = useState(defaultValue)

    const onChange = (attId, userId, e) => {
        setChecked(!e.target.checked)
        dispatch(updateAttendance({_id: attId, userId: userId, attType: e.target.checked}))
    }

    return (
        <TextField type="checkbox" id={id} name={id} checked={checked}
        onChange={(e) => onChange(attId, userId, e)} />
    )
  }
  
  export default CheckBox