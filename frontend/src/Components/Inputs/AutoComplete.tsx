import { Autocomplete, TextField } from "@mui/material";


export const AutoComplete = (props: any) => {
    const {options, getOptionLabel, label, error, helperText, onInputChange, onChange, ...other} = props;

    return (
        <Autocomplete
            options={options}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => <TextField required {...params} variant='outlined' label={label} error={error} helperText={helperText}/>}
            onInputChange={onInputChange}
            onChange={onChange}
            {...other}
        />
    );
} 