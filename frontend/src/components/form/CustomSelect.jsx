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
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ClearIcon from '@mui/icons-material/Clear';
import { CircularProgress } from '@mui/material';

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

const CustomSelect = ({ id, label, items, selectedItems = [], getItems, itemsStatus, formData, setFormData, multiple}) => {
    const [selected, setSelected] = React.useState(multiple ? [] : "")
    const dispatch = useDispatch()

    React.useEffect(() => {
        if(itemsStatus === Status.Idle) dispatch(getItems())
        if(itemsStatus === Status.Success) setSelected(selectedItems)
    }, [itemsStatus, getItems, selectedItems, dispatch])

    const onSelectChange = (e) => {
        const value = e.target.value

        setSelected(value);
        setFormData({
            ...formData,
            [e.target.name]: value,
        })
    }

    const handleDelete = (itemId) => {
        let filteredSelected = selected.filter(s => s !== itemId)

        setSelected(filteredSelected);
        setFormData({
            ...formData,
            [id]: filteredSelected,
        })
    }

    if(itemsStatus === Status.Loading || itemsStatus === Status.Idle) {
        return <CircularProgress /> 
    }

    return (
    <div>
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
                renderValue={(s) => multiple ?
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {s.map((item) => (
                        <Chip key={item} label={items.find(i => i._id === item).title} onDelete={() => handleDelete(s[0])} 
                        deleteIcon={<ClearIcon onMouseDown={(event) => event.stopPropagation()}/> }/>
                        ))}
                    </Box>
                    : items.find(i => i._id === s).title}
                MenuProps={MenuProps}>
                    {items.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                        {multiple && <Checkbox checked={selected.indexOf(item._id) > -1} />}
                        <ListItemText primary={item.title} />
                    </MenuItem>
                    ))}
            </Select>
        </FormControl>
    </div>
    )
}

export default CustomSelect