import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const BackButton = (props: any) => {
    const { to, size, ...other} = props;
    return (
        <IconButton component={Link} to={to} {...other}>
            <ArrowBackIcon fontSize={size || "large"}/>
        </IconButton>
    );
}