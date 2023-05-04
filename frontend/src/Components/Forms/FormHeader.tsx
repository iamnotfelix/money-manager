import { Stack, Typography } from "@mui/material"
import { BackButton } from "../BackButton"

export const FormHeader = (props: any) => {
    const { to, title, variant } = props;
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx ={{mb: 3}}>
            <Typography variant={variant || "h2"}>{title}</Typography>
            <BackButton to={to}/>
        </Stack>
    );
}