import { Container, IconButton, Stack, Typography } from "@mui/material";
import { ExpensesTable } from "../../Components/Tables/ExpensesTable";
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";


export const Expenses = () => {
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
                <Typography variant="h2">Expenses</Typography>
                <Link to={"/expenses/add"}>
                    <IconButton size="large">
                        <AddIcon fontSize="large"/>
                    </IconButton>
                </Link>
            </Container>
            <ExpensesTable/>
        </Container>
    );
}