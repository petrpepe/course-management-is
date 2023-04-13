import {useState, useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useNavigate, useParams} from "react-router-dom"
import useForceUpdate from "../../hooks/useForceUpdate"
import {toast} from "react-toastify"
import {FaUser} from "react-icons/fa"
import {createUser, updateUser} from "../../features/users/userSlice"
import { getRoles, reset as roleReset } from "../../features/roles/roleSlice"
import { getPermissions, reset as permReset} from "../../features/permissions/permissionSlice"
import Input from "../../components/form/Input"
import Select from 'react-select'
import Spinner from "../../components/Spinner"
import { updateAuth } from "../../features/auth/authSlice"

function UserAction() {
  const [formData, setFormData] = useState({
    firstName: "",
    otherNames: [],
    lastName: "",
    email: "",
    password: "",
    password2: "",
    phone: [],
    roles: [],
    extraPerms: [],
  })

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const forceUpdate = useForceUpdate()

  const { id } = useParams()
  const { user } = useSelector((state) => state.auth)
  const users = useSelector((state) => state.users)
  const roles = useSelector((state) => state.roles)
  const permissions = useSelector((state) => state.permissions)

  useEffect(() => {
    if(roles.isError || permissions.isError || users.isError) {
      toast.error("roles: " + roles.message + " permissions: " + permissions.message + " users: " + users.message)
    }

    if(!user) {
      navigate("/")
      return
    }

    if(user._id !== id || user.roles.includes("admin")) {
      dispatch(getRoles())
      dispatch(getPermissions())
    }

    return () => {
      dispatch(roleReset())
      dispatch(permReset())
    }
  }, [user, id, navigate, roles.isError, roles.message, permissions.isError, permissions.message, users.isError, users.message, dispatch])

  const currentUser = location.state ? location.state.currentUser : formData
  if(id !== currentUser._id) return <p>Ids are not equal</p>

  if (location.state && formData.email === "") {
    for (const key in currentUser) {
      if (Object.hasOwnProperty.call(currentUser, key)) {
        formData[key] = currentUser[key];
      }
    }
  }

  const roleOptions = roles.roles.map((role) => {
    if (formData.roles.length > 0 && (formData.roles.includes(role._id) || formData.roles.includes(role.name))) {
      return {value: role._id, label: role.name, permissions: role.permissions, isSelected: true}
    } else return {value: role._id, label: role.name, permissions: role.permissions, isSelected: false}
  }).filter(role => role != null)
console.log(currentUser);
  const rolesPermissions = roleOptions.filter(roleOpt => roleOpt.isSelected).map(role => role.permissions).flat()
  
  const permsOptions = permissions.permissions.map((perm) => {
    if (rolesPermissions.length > 0 && (rolesPermissions.includes(perm._id) || rolesPermissions.includes(perm.name))) {
      if (formData.extraPerms && (formData.extraPerms.includes(perm._id) || formData.extraPerms.includes(perm.name))) {
        return {value: perm._id, label: perm.name, isSelected: true, isFixed: false}
      } else return {value: perm._id, label: perm.name, isSelected: false, isFixed: false}
    } else return null
  }).filter(permOpt => permOpt != null)

  if (location.state && roleOptions.length > 0) {
    formData.roles = roleOptions.filter(role => role.isSelected).map(role => role.value)
    formData.extraPerms = permsOptions.filter(perm => perm.isSelected).map(perm => perm.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if(formData.password !== formData.password2) {
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
          navigate("/me")
        }
        else navigate("/users/" + id)
      } else {
        dispatch(createUser(userData))
        forceUpdate()
        if(users.isSuccess) navigate("/users/" + users.users[0]._id)
      }
      setFormData({})
    }
  }

  const onChange = (e) => {
    const inputName = e.target.name
    setFormData({
        ...formData,
        [inputName]: e.target.value,
    })
  }

  const onSelectChange = (e, a) => {
    const selectName = a.name
    let selectedOptionsValues = e.map((opt) => (opt.value))

    setFormData({
      ...formData,
      [selectName]: selectedOptionsValues,
    })
  }

  if (roles.isLoading || permissions.isLoading) {
    return <Spinner />
  }

  return <>
      <section className="heading">
        <h1>
            <FaUser /> {id ? (id === user._id ? "Edit your profile" : "Editing user: " + currentUser.firstName + " " + currentUser.lastName ) : "Create user"}
        </h1>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <Input  id="firstName" label="First name:" value={currentUser.firstName} 
          placeholder="Enter first name" onChange={onChange} required={true} />
          {/* otherNames textarea nebo inputy s +? */}
          <Input  id="lastName" label="Last name:" value={currentUser.lastName} 
          placeholder="Enter last name" onChange={onChange} required={true} />
          <Input  id="email" label="Email:" value={currentUser.email} type="email" 
          placeholder="Enter email" onChange={onChange} required={true} />
          <Input  id="password" label="Enter password:" value={currentUser.password} type="password" 
          placeholder="Enter password" onChange={onChange} required={true} />
          <Input  id="password2" label="Confirm password:" value={currentUser.password2} type="password" 
          placeholder="Confirm password" onChange={onChange} required={true} />
          { ((user._id !== currentUser._id || user.roles.includes("admin"))) && roles.roles && permissions.permissions ?
            <>
              <div className="form-group ">
                <label htmlFor="roles">Select roles:</label>
                <Select id="roles" name="roles" options={roleOptions} defaultValue={roleOptions.filter((role) => role.isSelected)} onChange={onSelectChange} isMulti isSearchable isClearable />
              </div>
              <div className="form-group ">
                <label htmlFor="extraPerms">Select extra permissions:</label>
                <Select id="extraPerms" name="extraPerms" options={permsOptions} defaultValue={permsOptions.filter((perm) => perm.isSelected)} onChange={onSelectChange} isMulti isSearchable isClearable />
              </div>
            </>
          : <></> }
          <div className="form-group">
            <button type="submit" className="btn btn-block">{location.pathname.includes("create") ? "Create" : "Submit"}</button>
          </div>
        </form>
      </section>
    </>
}

export default UserAction