import Select from 'react-select'

const CustomSelect = ({ id, label, options, formData, setFormData}) => {
    const onSelectChange = (e, a) => {
        const selectName = a.name
        let selectedOptionsValues = e.map((opt) => (opt.value))
    
        setFormData({
            ...formData,
            [selectName]: selectedOptionsValues,
        })
    }
    
    return (
        <div className="form-group ">
            <label htmlFor={id}>{label}</label>
            <Select id={id} name={id} options={options} value={options.filter((option) => option.isSelected)} onChange={onSelectChange} isMulti isSearchable isClearable />
        </div>
    )
}

function filterRoles(options) {
    
}

export default CustomSelect