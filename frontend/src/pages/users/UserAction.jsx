import {useState, useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {toast} from "react-toastify"
import {FaUser} from "react-icons/fa"
import {createUser, getUsers, updateUser} from "../../features/users/userSlice"
import { getRoles, reset as roleReset } from "../../features/roles/roleSlice"
import { getPermissions, reset as permReset} from "../../features/permissions/permissionSlice"
import Input from "../../components/form/Input"
import Spinner from "../../components/Spinner"
import { updateAuth } from "../../features/auth/authSlice"
import PhoneInputs from "../../components/users/PhoneInputs"
import CustomSelect from "../../components/users/CustomSelect"

function UserAction() {
  const [isCreate, setIsCreate] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    otherNames: [],
    lastName: "",
    email: "",
    password: "",
    password1: "",
    phone: [],
    roles: [],
    extraPerms: [],
  })

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()
  const { user } = useSelector((state) => state.auth)
  const users = useSelector((state) => state.users)
  const roles = useSelector((state) => state.roles)
  const permissions = useSelector((state) => state.permissions)

  useEffect(() => {
    if(roles.isError || permissions.isError || users.isError) {
      toast.error("roles: " + roles.message + " permissions: " + permissions.message + " users: " + users.message)
    }

    if(user._id !== id || user.roles.includes("admin")) {
      dispatch(getRoles())
      dispatch(getPermissions())
    }

    if (id) {
      dispatch(getUsers({ids: id, detail: true}))
    }

    setFormData({
      firstName: "",
      otherNames: [],
      lastName: "",
      email: "",
      password: "",
      password1: "",
      phone: [],
      roles: [],
      extraPerms: [],
    })

    return () => {
      dispatch(roleReset())
      dispatch(permReset())
    }
  }, [user, id, navigate, roles.isError, roles.message, permissions.isError, permissions.message, users.isError, users.message, dispatch])

  if(isCreate && users.users[0]) {
    setFormData({})
    navigate("/users/" + users.users[0]._id)
  }

  if(location.state && id !== location.state.currentUser._id) return <p>Ids are not equal</p>
  const userDetail = id === user._id ? user : users.users[0]

  if (formData.email === "" && users.users.length > 0) {
    for (const key in userDetail) {
      if (Object.hasOwnProperty.call(userDetail, key)) {
        formData[key] = userDetail[key];
      }
    }
  }

  const roleOptions = roles.roles.map((role) => {
    if (formData.roles && (formData.roles.includes(role._id) || formData.roles.includes(role.name))) {
      return {value: role._id, label: role.name, permissions: role.permissions, isSelected: true}
    } else return {value: role._id, label: role.name, permissions: role.permissions, isSelected: false}
  }).filter(role => role != null)

  const rolesPermissions = roleOptions.filter(roleOpt => roleOpt.isSelected).map(role => role.permissions).flat()

  const permsOptions = permissions.permissions.map((perm) => {
    if (formData.extraPerms && rolesPermissions && !(rolesPermissions.includes(perm._id) || rolesPermissions.includes(perm.name))) {
      if (formData.extraPerms.includes(perm._id) || formData.extraPerms.includes(perm.name)) {
        return {value: perm._id, label: perm.name, isSelected: true}
      } else return {value: perm._id, label: perm.name, isSelected: false}
    } else return null
  }).filter(permOpt => permOpt != null)

  /*if (location.state && roleOptions.length > 0 && permsOptions.length > 0) {
    formData.roles = roleOptions.filter(role => role.isSelected).map(role => role.value)
    formData.extraPerms = permsOptions.filter(perm => perm.isSelected).map(perm => perm.value)
  }*/

  const onSubmit = (e) => {
    e.preventDefault()

    if(formData.password !== formData.password1) {
        toast.error("Passwords do not match")
    } else {
        const userData = {
            firstName: formData.firstName,
            otherNames: formData.otherNames,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
        }

        if(user._id !== formData._id || user.roles.includes("admin")) {
            userData.roles = formData.roles
            userData.extraPerms = formData.extraPerms
        }

        if(id){
            userData._id = id
            dispatch(updateUser(userData))
          if(user._id === id) {
            userData.roles = roleOptions.filter(roleOpt => roleOpt.isSelected).map(roleOpt => roleOpt.label)
            dispatch(updateAuth(userData))
            setFormData({})
            navigate("/me")
          }
          else {
            setFormData({})
            navigate("/users/" + id)
          }
        } else {
            dispatch(createUser(userData))
            setIsCreate(true)
        }
    }
  }

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (roles.isLoading || permissions.isLoading) {
    return <Spinner />
  }

  return <>
    <section className="heading">
        <h1>
            <FaUser /> {id && userDetail ? (id === user._id ? "Edit your profile" : "Editing user: " + userDetail.firstName + " " + userDetail.lastName ) : "Create user"}
        </h1>
    </section>
    <section className="form">
      <form onSubmit={onSubmit}>
        <Input  id="firstName" label="First name:" value={formData.firstName} 
          placeholder="Enter first name" onChange={onChange} required={true} />
        {/* otherNames textarea nebo inputy s +? */}
        <Input  id="lastName" label="Last name:" value={formData.lastName} 
          placeholder="Enter last name" onChange={onChange} required={true} />
        <Input  id="email" label="Email:" value={formData.email} type="email" 
          placeholder="Enter email" onChange={onChange} required={true} />
        <PhoneInputs name="number" placeholder="Enter phone number" listName="type" 
          formData={formData} setFormData={setFormData} />
        <Input  id="password" label="Enter password:" value={formData.password} type="password"
          placeholder="Enter password" onChange={onChange} required={id === user._id ? true : false} />
        <Input  id="password1" label="Confirm password:" value={formData.password1} type="password" 
          placeholder="Confirm password" onChange={onChange} required={id === user._id ? true : false} />
        { (user.roles.includes("admin")) ?
        <>
          <CustomSelect id="roles" label="Select roles:" options={roleOptions} formData={formData} setFormData={setFormData} />
          <CustomSelect id="extraPerms" label="Select extra permissions:" options={permsOptions} formData={formData} setFormData={setFormData} />
        </>
        : null }
        <div className="form-group">
          <button type="submit" className="btn btn-block">{location.pathname.includes("create") ? "Create" : "Update"}</button>
        </div>
      </form>
    </section>
  </>
}

export default UserAction