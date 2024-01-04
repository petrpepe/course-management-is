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
  multiple = false,
  selectChange,
  changed,
}) {
  if (selectedItems.length === 0 && multiple === false) selectedItems = "";
  const [selected, setSelected] = React.useState(selectedItems);

  React.useEffect(() => {
    setSelected(multiple ? selectedItems : selectedItems[0]);
  }, [selectedItems]);

  const onSelectChange = (e, value) => {
    setSelected(value);
    setFormData({
      ...formData,
      [id]: multiple ? value.map((v) => v._id) : value._id,
    });
    if (changed) changed(true);
  };

  return (
    <div>
      <FormControl fullWidth sx={{ my: 1 }}>
        <Autocomplete
          id={id}
          multiple={multiple}
          disableCloseOnSelect={multiple}
          value={selected || null}
          onChange={selectChange || onSelectChange}
          renderInput={(params) => <TextField {...params} label={label} />}
          options={items}
          getOptionLabel={(option) => option.title}
          renderOption={(props, option, { selected }) => {
            return (
              <li {...props} key={option._id}>
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
