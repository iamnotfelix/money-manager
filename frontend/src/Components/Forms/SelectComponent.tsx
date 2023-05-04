import { MenuItem, TextField } from "@mui/material"

export const SelectComponent = (props: any) => {
    const { label, name, color, onChange, onInput, error, helperText, value, options, ...other } = props;

    return (
        <TextField
            select
            label={label}
            name={name}
            color={color || "primary"}
            onChange={(e: any) => {
                onChange(e);
                onInput(e);
            }}
            error={error}
            helperText={helperText}
            value={value}
            fullWidth
            required
        >
            <MenuItem value="">None</MenuItem>
            {options.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
        </TextField>
    );
}