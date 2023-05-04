import { Autocomplete, TextField } from "@mui/material";


export const AutoComplete = (props: any) => {
    const {options, getOptionLabel, label, name, error, helperText, onInputChange, onChange, onInput, ...other} = props;

    return (
        <Autocomplete
            name={name}
            options={options}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => <TextField required {...params} variant='outlined' label={label} error={error} helperText={helperText}/>}
            onInputChange={onInputChange}
            onChange={(e: any, value: any) => {
                const toPass = {
                    target: {
                        name: name,
                        value: value
                    }
                }
                onChange(toPass);
                onInput(toPass);
            }}
            {...other}
        />
    );
} 