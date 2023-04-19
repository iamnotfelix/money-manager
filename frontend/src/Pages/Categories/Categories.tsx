import { Container, IconButton, Typography } from "@mui/material";
import { CategoriesTable } from "../../Components/CategoriesTable";
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";


export const Categories = () => {
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
                <Typography variant="h2">Categories</Typography>
                <Link to={"/categories/add"}>
                    <IconButton size="large">
                        <AddIcon fontSize="large"/>
                    </IconButton>
                </Link>
            </Container>
            <CategoriesTable/>
        </Container>
    );
}