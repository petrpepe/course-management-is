import { FaMinusSquare, FaPlusSquare } from "react-icons/fa"

const PhoneInputs = ({ name, listName, options = [], formData, setFormData}) => {
  const onPhoneChange = (e, i) => {
    let phoneList = formData.phone

    phoneList[i] = {...formData.phone[i], [e.target.name]: e.target.value}

    setFormData({
      ...formData,
      phone: phoneList,
    })
  }

  const changeFields = (index) => {
    let newPhone = { number: '', type: '' }
    let phoneList = formData.phone

    if(index === 0) phoneList.push(newPhone);
    else if (index > 0) phoneList.splice(index, 1);

    setFormData({
        ...formData,
        phone: phoneList
    })
  }

  const phones = formData.phone.length === 0 ? [{ number: '', type: '' }] : formData.phone

  return (
    <div className="form-group ">
      <label htmlFor="phone0">Phone numbers:</label>
      {phones.map((phone, index) => <div key={index}>
        <input type="text" className="form-control" id={"type" + index} name={listName} placeholder="Phone type"
        list="datalist" value={phone.type} onChange={(e) => onPhoneChange(e, index)} style={{"width": "24%", "marginRight": "1%"}}/>
        <datalist id="datalist">
          {options.map((opt) => <>
            <option value={opt}>{opt}</option>
          </>)}
        </datalist>
        <input type="text" className="form-control" id={"phone" + index} name={name} placeholder="Phone number"
        value={phone.phone} onChange={(e) => onPhoneChange(e, index)} style={{"width": "69%", "marginRight": "1%"}} />
        <button type="button" onClick={() => changeFields(index)} style={{"width": "5%", "height": "42px"}}>{index === 0 ? <FaPlusSquare /> : <FaMinusSquare />}</button>
      </div>)}
    </div>
  )
}

export default PhoneInputs