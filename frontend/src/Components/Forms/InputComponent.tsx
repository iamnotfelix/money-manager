import { TextField } from "@mui/material";

export const InputComponent = (props: any) => {
    const { type, label, name, color, onChange, onInput, error, helperText, value, ...other } = props;

    return (
        <TextField
            variant="outlined"
            type={type || "text"}
            label={label}
            name={name}
            color={color || "primary"}
            onChange={onChange}
            onInput={onInput}
            error={error}
            helperText={helperText}
            value={value}
            fullWidth
            required
            {...other}
        />
    );
}