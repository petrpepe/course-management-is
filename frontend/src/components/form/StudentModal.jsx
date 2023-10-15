import * as React from 'react'
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import CustomSelect from "./CustomSelect"
import getUsers from "../../features/users/userSlice"
import Button from "@mui/material/Button"
import { createEnrollment } from '../../features/enrollments/enrollmentSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const StudentModal = ({users, defaultOpened, setOpenModal, classId}) => {
    const [formData, setFormData] = React.useState({classId: "", students: []});
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    return (
    <Dialog open={defaultOpened} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
            <DialogContentText>
                To subscribe to this website, please enter your email address here. We
                will send updates occasionally.
            </DialogContentText>
            <CustomSelect id="students" label="Select students" items={users.users.filter(u => u.roles.includes("student")).map(u => {return {_id: u._id, title: u.lastName + " " + u.firstName}})} 
            getItems={getUsers} itemsStatus={users.status} formData={formData.students} setFormData={setFormData} multiple={true} />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={onAdd}>Add</Button>
        </DialogActions>
    </Dialog>
    )
}

export default StudentModal