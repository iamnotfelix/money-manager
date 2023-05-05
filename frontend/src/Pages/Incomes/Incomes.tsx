import { Container, IconButton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import { IncomesTable } from "../../Components/Tables/IncomesTable";


export const Incomes = () => {
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
                <Typography variant="h2">Incomes</Typography>
                <Link to={"/incomes/add"}>
                    <IconButton size="large">
                        <AddIcon fontSize="large"/>
                    </IconButton>
                </Link>
            </Container>
            <IncomesTable/>
        </Container>
    );
}