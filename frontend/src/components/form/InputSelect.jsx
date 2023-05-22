import { FaMinusSquare, FaPlusSquare } from "react-icons/fa"

const InputSelect = ({ id, value, name, type = "text", listId, listName, listValue, listType = "text", placeholder = "", 
onChange, options = [], className = "form-control", label = "", required, changeFields, plus}) => {
    return (
      <div className="form-group ">
            {label ? <label htmlFor={id}>{label}</label> : ""}
            <input type={listType} className={className} id={listId} name={listName} placeholder="Phone type"
            list="datalist" defaultValue={listValue} onChange={onChange} required={required} style={{"width": "24%", "marginRight": "1%"}}/>
            <datalist id="datalist">
                {options.map((opt) => <>
                    <option value={opt}>{opt}</option>
                </>)}
            </datalist>
            <input type={type} className={className} id={id} name={name} placeholder={placeholder} 
            defaultValue={value} onChange={onChange} required={required} style={{"width": "70%"}} />
            <button type="button" onClick={() => changeFields(plus)} style={{"width": "5%", "height": "42px"}}>{plus ?<FaPlusSquare />:<FaMinusSquare />}</button>
      </div>
    )
  }
  
  export default InputSelect