import {useState, useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate, useParams} from "react-router-dom"
import PersonIcon from '@mui/icons-material/Person';
import {createUser, getUsers, updateUser, reset as resetUsers} from "../../features/users/userSlice"
import { getRoles, reset as resetRoles } from "../../features/roles/roleSlice"
import { getPermissions, reset as resetPermissions} from "../../features/permissions/permissionSlice"
import { updateAuth } from "../../features/auth/authSlice"
import PhoneInputs from "../../components/users/PhoneInputs"
import CustomSelect from "../../components/form/CustomSelect"
import useGetData from "../../hooks/useGetData"
import { Status } from "../../features/Status"
import CircularProgress from "@mui/material/CircularProgress"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { Typography } from "@mui/material";

function UserAction() {
  const [isCreated, setIsCreated] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    otherNames: "",
    lastName: "",
    email: "",
    password: "",
    password1: "",
    phone: [{ number: '', type: '' }],
    roles: [],
    extraPerms: [],
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()
  const { user } = useSelector((state) => state.auth)
  const users = useGetData("users", getUsers, resetUsers, id)
  const roles = useGetData("roles", getRoles, resetRoles)
  const permissions = useGetData("permissions", getPermissions, resetPermissions)

  useEffect(() => {
    if(id && users.status === Status.Success) setFormData(users.users.filter(u => u._id === id)[0])
  }, [id, users.status, users.users])

  if (isCreated && users.status === Status.Success) {
    navigate("/users/" + users.users[users.users.length-1]._id)
  }

  if(users.status === Status.Loading || users.status === Status.Idle) {
    return <CircularProgress />
  }

  const selectedRolesPermissons = roles.roles.filter(r => formData.roles.includes(r._id)).flatMap(r => r.permissions);
  const avaiblePermissions = permissions.permissions.filter(p => !selectedRolesPermissons.includes(p._id))

  const onSubmit = (e) => {
    e.preventDefault()

    if(formData.password !== formData.password1) {
    } else {
      const userData = {
          firstName: formData.firstName,
          otherNames: formData.otherNames,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
      }

      if(user._id !== id || user.roles.includes("admin")) {
          userData.roles = formData.roles
          userData.extraPerms = formData.extraPerms
      }

      if(id){
        userData._id = id
        dispatch(updateUser(userData))
        if(user._id === id) {
          userData.roles = roles.roles.filter(r => userData.roles.includes(r._id)).map(r => r.name)
          dispatch(updateAuth(userData))
          navigate("/me")
        }
        else {
          navigate("/users/" + id)
        }
      } else {
          dispatch(createUser(userData))
          setIsCreated(true)
      }
    }
  }

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const phones = JSON.parse(JSON.stringify(formData.phone))

  return <>
    <section className="heading">
        <Typography variant="h2">
            <PersonIcon fontSize="large" /> {!id ? "Create user" : (id === user._id ? "Edit your profile" : "Editing user: " + formData.firstName + " " + formData.lastName )}
        </Typography>
    </section>
    <section className="form">
      <form onSubmit={onSubmit}>
        <TextField  id="firstName" name="firstName" label="First name:" value={formData.firstName} 
          placeholder="Enter first name" onChange={(e) => onChange(e)} required={true} size="medium" fullWidth sx={{my: 1}} />
        <TextField  id="otherNames" name="otherNames" label="Middle names:" value={formData.otherNames} 
          placeholder="Enter middle names" onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
        <TextField  id="lastName" name="lastName" label="Last name:" value={formData.lastName} 
          placeholder="Enter last name" onChange={(e) => onChange(e)} required={true} size="medium" fullWidth sx={{my: 1}} />
        <TextField  id="email" name="email" label="Email:" value={formData.email} type="email" 
          placeholder="Enter email" onChange={(e) => onChange(e)} required={true} size="medium" fullWidth sx={{my: 1}} />
        <PhoneInputs name="number" placeholder="Enter phone number" listName="type" 
          phones={phones} formData={formData} setFormData={setFormData} />
        <TextField  id="password" name="password" label="Password:" value={formData.password} type="password"
          placeholder="Enter password" onChange={(e) => onChange(e)} required={id === user._id ? true : false} size="medium" fullWidth sx={{my: 1}} />
        <TextField  id="password1" name="password1" label="Confirm password:" value={formData.password1}  type="password"
          placeholder="Confirm password" onChange={(e) => onChange(e)} required={id === user._id ? true : false} size="medium" fullWidth sx={{my: 1}} />
        { (user.roles.includes("admin")) ?
        <>
          <CustomSelect id="roles" label="Select roles" items={roles.roles.map(r => {return {_id: r._id, title: r.name}})} getItems={getRoles} itemsStatus={roles.status}
            formData={formData} selectedItems={formData.roles} setFormData={setFormData} multiple={true} />
          <CustomSelect id="extraPerms" label="Select extra permissions" items={avaiblePermissions.map(p => {return {_id: p._id, title: p.name}})} 
          getItems={getPermissions} itemsStatus={permissions.status} formData={formData} selectedItems={formData.extraPerms} setFormData={setFormData} multiple={true} />
        </>
        : null }
        <Button type="submit" size="large" variant="outlined" fullWidth sx={{my: 1}} >Submit</Button>
      </form>
    </section>
  </>
}

export default UserAction