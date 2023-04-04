import {useState, useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {toast} from "react-toastify"
import {FaUser} from "react-icons/fa"
import {createUser, updateUser} from "../../features/users/userSlice"
import { getRoles, reset as roleReset } from "../../features/roles/roleSlice"
import { getPermissions, reset as permReset} from "../../features/permissions/permissionSlice"
import Input from "../../components/form/Input"
import Select from 'react-select'
import Spinner from "../../components/Spinner"

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

  const { id } = useParams()
  const { user } = useSelector((state) => state.auth)
  const users = useSelector((state) => state.users)
  const roles = useSelector((state) => state.roles)
  const permissions = useSelector((state) => state.permissions)

  useEffect(() => {
    if(roles.isError || permissions.isError) {
      toast.error("roles: " + roles.message + "\n permissions: " + permissions.message)
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
  }, [user, id, navigate, roles.isError, roles.message, permissions.isError, permissions.message, dispatch])

  const currentUser = location.state ? location.state.currentUser : formData
  if(id !== currentUser._id) return <p>Ids are not equal</p>

  if (location.state && location.state.currentUser && !formData.email) {
    for (const key in location.state.currentUser) {
      if (Object.hasOwnProperty.call(location.state.currentUser, key)) {
        formData[key] = location.state.currentUser[key];
      }
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if(formData.password !== formData.password2) {
      toast.error("Passwords do not match")
    } else {
      console.log(formData);
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
        userData._id = currentUser._id
        dispatch(updateUser(userData))
        if(user._id === id) {
          navigate("/me")
          delete userData._id
          delete userData.password
          delete userData.password2
          let updatedUser = JSON.parse(localStorage.getItem("user"))
          updatedUser = {...userData}
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
        else navigate("/users/" + id)
      } else {
        dispatch(createUser(userData))
        console.log(users);
        if(!users.isError && !users.isLoading) navigate("/users/" + users.users[0]._id)
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
    let selectedOptionsValues = e.map((e) => (e.value))

    setFormData({
      ...formData,
      [selectName]: selectedOptionsValues,
    })
  }

  if (roles.isLoading || permissions.isLoading) {
    return <Spinner />
  }

  const roleOptions = roles.roles.map((role) => ({value: role._id, label: role.name}))
  const roleDefaultOptions = roleOptions.filter((role) => Object.values(role).indexOf(currentUser.roles) > -1)
  const permsOptions = permissions.permissions.map((perm) => ({value: perm._id, label: perm.name}))
  const permsDefaultOptions = permsOptions.filter((perm) => Object.values(perm).indexOf(currentUser.extraPerms) > -1)
  if (location.state && location.state.currentUser && !formData.email) {
    formData.roles = roleDefaultOptions.map((role) => role.value)
    formData.extraPerms = permsDefaultOptions.map((perm) => perm.value)
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
          { (user._id !== currentUser._id || user.roles.includes("admin")) && roles.roles && permissions.permissions ?
            <>
              <div className="form-group ">
                <label htmlFor="roles">Select roles:</label>
                <Select id="roles" name="roles" options={roleOptions} defaultValue={roleDefaultOptions} onChange={onSelectChange} isMulti isSearchable />
              </div>
              <div className="form-group ">
                <label htmlFor="roles">Select extra permissions:</label>
                <Select id="extraPerms" name="extraPerms" options={permsOptions} defaultValue={permsDefaultOptions} onChange={onSelectChange} isMulti isSearchable />
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