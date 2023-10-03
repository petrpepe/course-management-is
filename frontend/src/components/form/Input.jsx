import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';

const Input = ({ id, value, label = "", type = "text", onChange, required, min, error, helperText = "This field cant be empty" }) => {
  return (
    <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <OutlinedInput type={type} id={id} name={id} label={label} min={min} defaultValue={value} 
        onChange={onChange} required={required} error={error} helperText={helperText}/>
    </FormControl>
  )
}

export default Input