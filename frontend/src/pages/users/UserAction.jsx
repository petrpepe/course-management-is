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
  })

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()
  const user = useSelector((state) => state.auth)

  if(user._id !== id || user.roles.includes("admin")) {
    formData.roles = []
    formData.extraPerms = []
  }

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

  const onChange = (e) => {
    setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if(currentUser.password !== currentUser.password2) {
      toast.error("Passwords do not match")
    } else {
      const userData = {
        firstName: currentUser.firstName,
        otherNames: currentUser.otherNames,
        lastName: currentUser.lastName,
        email: currentUser.email,
        password: currentUser.password,
        phone: currentUser.phone,
      }

      if(user._id !== currentUser._id || user.roles.includes("admin")) {
        userData.roles = currentUser.roles
        userData.extraPerms = currentUser.extraPerms
      }

      if(id){
        dispatch(updateUser(userData))
      } else {
        dispatch(createUser(userData))
      }
    }
  }

  const onSelectChange = e => {
    let selectedOptionsValues = [];

    for (let index = 0; index < e.length; index++) {
      selectedOptionsValues[index] = e[index].value
    }

    setFormData((prevState) => ({
      ...prevState,
      [e.name]: selectedOptionsValues,
    }))
  }

  
  const currentUser = location.state ? location.state.currentUser : formData
  if(id !== currentUser._id) return <p>Ids are not equal</p>

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
          { (user._id !== currentUser._id || user.roles.includes("admin")) && roles.roles && permissions.permissions ?
            <>
            <div className="form-group ">
              <label htmlFor="roles">Select roles:</label>
              <Select id="roles" name="roles" options={roles.roles.map((role) => ({value: role._id, label: role.name}))} onChange={onSelectChange} isMulti isSearchable />
            </div>
            <div className="form-group ">
              <label htmlFor="roles">Select extra permissions:</label>
              <Select id="extraPerms" name="extraPerms" options={permissions.permissions.map((perm) => ({value: perm._id, label: perm.name}))} onChange={onSelectChange} isMulti isSearchable />
            </div>
            </>
          : <></> }
          <div className="form-group">
              <button type="submit" className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
}

export default UserAction