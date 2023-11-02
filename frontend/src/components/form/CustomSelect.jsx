import * as React from "react";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

function CustomSelect({
  id,
  label,
  items,
  selectedItems = [],
  formData,
  setFormData,
  multiple,
}) {
  const [selected, setSelected] = React.useState(selectedItems);

  const onSelectChange = (e, value) => {
    setSelected(value);
    setFormData({
      ...formData,
      [id]: value._id ? value._id : value.map((v) => v._id),
    });
  };

  return (
    <div>
      <FormControl fullWidth sx={{ my: 1 }}>
        <Autocomplete
          id={id}
          multiple={multiple}
          disableCloseOnSelect={multiple}
          value={selected || null}
          onChange={onSelectChange}
          renderInput={(params) => <TextField {...params} label={label} />}
          options={items}
          getOptionLabel={(option) => option.title}
          renderOption={(props, option, { selected }) => {
            return (
              <li {...props}>
                {multiple && <Checkbox checked={selected} />}
                {option.title}
              </li>
            );
          }}
          isOptionEqualToValue={(o, v) => o._id === v._id}
        />
      </FormControl>
    </div>
  );
}

export default CustomSelect;
