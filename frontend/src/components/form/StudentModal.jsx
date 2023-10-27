import * as React from 'react'
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import CustomSelect from "./CustomSelect"
import Button from "@mui/material/Button"
import { createEnrollment } from '../../features/enrollments/enrollmentSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useGetData from '../../hooks/useGetData'
import { getRoles, reset as resetRoles } from "../../features/roles/roleSlice"
import { Status } from '../../features/Status'
import { CircularProgress } from '@mui/material'

const StudentModal = ({users, defaultOpened, setOpenModal, classId}) => {
    const [formData, setFormData] = React.useState({classId: "", students: []});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const roles = useGetData("roles", getRoles, resetRoles)

    const handleClose = (e, reason) => {
        if (reason !== 'backdropClick') {
            setOpenModal(false);
        }
    };

    const onAdd = () => {
        formData.classId = classId
        dispatch(createEnrollment(formData))
        setOpenModal(false);
        navigate("/classes/" + classId)
    }

    const studentsOptions = users.users.filter(u => u.roles.includes(roles.roles.filter(r => r.name === "student")[0]._id))
    if (roles.status === Status.Loading || roles.status === Status.Idle) {
        return <CircularProgress />
    }

    return (
    <Dialog open={defaultOpened} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
            <DialogContentText>
                To subscribe to this website, please enter your email address here. We
                will send updates occasionally.
            </DialogContentText>
            <CustomSelect id="students" label="Select students" items={studentsOptions.map(u => {return {_id: u._id, title: u.lastName + " " + u.firstName}})} 
            itemsStatus={users.status} formData={formData.students} setFormData={setFormData} multiple={true} selectedItems={formData.students} />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={onAdd}>Add</Button>
        </DialogActions>
    </Dialog>
    )
}

export default StudentModal