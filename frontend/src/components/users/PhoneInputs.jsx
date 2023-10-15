import { Button, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

const PhoneInputs = ({ name, listName, formData, phones, setFormData}) => {
  const [phoneList, setPhoneList] = useState(phones)

  useEffect(() => {
    setPhoneList(phones)
  }, [phones])

  const onPhoneChange = (e, i) => {
    let changedPhoneList = phoneList
    changedPhoneList[i][e.target.name] = e.target.value
    setPhoneList(changedPhoneList)

    setFormData({
      ...formData,
      phone: changedPhoneList,
    })
  }

  const changeFields = (index) => {
    let newPhone = {_id: '', number: '', type: '' }
    let newPhoneList = phoneList

    if(index === 0) newPhoneList.push(newPhone);
    else if (index > 0) newPhoneList.splice(index, 1);

    setFormData({
      ...formData,
        phone: newPhoneList
    })
    setPhoneList(newPhoneList)
  }

  return (
  <>
    <Typography variant="subtitle1" sx={{textAlign: "left"}}>Phone numbers:</Typography>
    {phoneList.map((phone, index) => <div key={index}>
      <TextField  id={"type" + index} name={listName} value={phone.type} sx={{my: 1, mr: 1, width: "45%"}}
        placeholder="Enter phone type" onChange={(e) => onPhoneChange(e, index)} size="medium" />
      <TextField  id={"phone" + index} name={name} value={phone.number} sx={{my: 1, mr: 1, width: "45%"}}
        placeholder="Enter phone number" type="tel" onChange={(e) => onPhoneChange(e, index)} size="medium" />
      <Button type="button" onClick={() => changeFields(index)} size="large" variant="outlined" sx={{my: 1}}>{index === 0 ? <AddBoxIcon /> : <IndeterminateCheckBoxIcon />}</Button>
    </div>)}
  </>
  )
}

export default PhoneInputs