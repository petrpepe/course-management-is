const Input = ({ id, value, label, type = "text", placeholder = "", onChange }) => {
  return (
      <div className="form-group ">
        <label htmlFor={id}>{label}</label>
        <input type={type} className="form-control" id={id} name={id} placeholder={placeholder} 
        defaultValue={value} onChange={onChange}/>
      </div>
  )
}

export default Input