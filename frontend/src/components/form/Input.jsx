const Input = ({ id, value, className = "form-control", label = "", type = "text", placeholder = "", onChange, required, min }) => {
  return (
    <div className="form-group ">
        {label ? <label htmlFor={id}>{label}</label> : ""}
        <input type={type} className={className} id={id} name={id} placeholder={placeholder} 
        defaultValue={value} onChange={onChange} required={required} min={min}/>
    </div>
  )
}

export default Input