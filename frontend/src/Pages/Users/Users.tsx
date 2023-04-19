import { Container, IconButton, Typography } from "@mui/material";
import { UsersTable } from "../../Components/UsersTable";
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";


export const Users = () => {
    return (
        <Container sx={{
            display: "flex",
            flexDirection: "column",
            alignItems:"center"

        }}>
            <Container sx={{
                display: "flex",
                flexDirection:"row",
                justifyContent:"space-between",
                alignItems:"center",
                m: 2
            }}
                >
                <Typography variant="h2">Users</Typography>
                <Link to={"/users/add"}>
                    <IconButton size="large">
                        <AddIcon fontSize="large"/>
                    </IconButton>
                </Link>
            </Container>
            <UsersTable/>
        </Container>
    );
}