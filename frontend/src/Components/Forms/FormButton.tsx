import { Button } from "@mui/material";

export const FormButton = (props: any) => {
    const { text, size, color, variant, onClick, ...other } = props;
    
    return (
        <Button 
            variant={variant || "outlined"} 
            color={color || "primary"} 
            onClick={onClick}
            size={size || "medium"}
            fullWidth 
            {...other}
        >
            {text}
        </Button>
    );
}