import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Status } from '../../features/Status';
import { useDispatch } from 'react-redux'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
    anchorOrigin: {
        vertical: "bottom",
        horizontal: "left"
    },
    transformOrigin: {
        vertical: "top",
        horizontal: "left"
    },
};

const CustomSelect = ({ id, label, items, getItems, itemsStatus, formData, setFormData, compareItems, multiple}) => {
    const [selected, setSelected] = React.useState([])
    const dispatch = useDispatch()

    React.useEffect(() => {
        if(itemsStatus === Status.Idle) dispatch(getItems())
    }, [itemsStatus, getItems, dispatch])

    const onSelectChange = (e) => {
        const value = e.target.value
        setSelected(Array.isArray(value) ? value.map(v => v.label).split(',') : value.label);

        setFormData({
            ...formData,
            [e.target.name]: Array.isArray(value) ? value.map(v => v._id) : value._id,
        })
    }

    return (
    <div>
        {itemsStatus === Status.Loading || itemsStatus === Status.Idle ? <p>Loading</p> :
        <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel id={id + "-label"}>{label}</InputLabel>
            <Select
                labelId={id + "-label"}
                id={id}
                name={id}
                multiple={multiple}
                value={selected}
                onChange={onSelectChange}
                input={<OutlinedInput label={label} />}
                renderValue={(e) => Array.isArray(e) ? e.join(", ") : e}
                MenuProps={MenuProps}>
                    {items.map((item) => (
                    <MenuItem key={item._id} value={{_id: item._id, label: item.title ? item.title : (item.name ? item.name : item.lastName + item.firstName)}}>
                        {multiple ? <Checkbox checked={selected.indexOf(item._id) > -1} /> : null}
                        <ListItemText primary={item.title ? item.title : (item.label ? item.label : item.lastName + item.firstName)} />
                    </MenuItem>
                    ))}
            </Select>
        </FormControl>}
    </div>
    )
}

function transfromData(options) {
    
}

export default CustomSelect