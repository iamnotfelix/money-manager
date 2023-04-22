import { Card, CardContent, Container, Paper, Stack, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Category } from "../Models/Category";
import { Link } from "react-router-dom";


export const StatisticalReport = () => {

    const [loading, setLoading] = useState(false);
    const [minCategory, setMinCategory] = useState<Category | null>(null);
    const [maxCategory, setMaxCategory] = useState<Category | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchMinimum = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories/minimum`);
            const res = await data.json();
            setMinCategory(res);
        }
        const fetchMaximum = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories/maximum`);
            const res = await data.json();
            setMaxCategory(res);
        }
        fetchMinimum();
        fetchMaximum();
        setLoading(false);
    }, []);

    return (
        <Container>
            {loading && <Stack alignItems="center" mt={4}><Typography variant="h3" gutterBottom>Still loading...</Typography></Stack>}
            {!loading &&
            <Card>
                <CardContent>
                    <Container sx={{
                        display: "flex",
                        gap: "10px",
                        mb: 2,
                        p:0
                    }}>
                        <Typography variant="h3">Category with minimum total </Typography>
                    </Container>
                    <TableContainer component={Paper}>
                        <TableRow>
                            <TableCell><Typography variant="h6">Name</Typography></TableCell>
                            <TableCell sx={{width: "10000px"}}>
                                <Typography component={Link} to={`/categories/${minCategory?.id}`} variant="subtitle1" color="secondary" sx={{textDecoration: "none"}}>{minCategory?.name}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="h6">Total</Typography></TableCell>
                            <TableCell>
                                <Typography variant="subtitle1">{minCategory?.total}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableContainer>
                </CardContent>
                <CardContent>
                    <Container sx={{
                        display: "flex",
                        gap: "10px",
                        mb: 2,
                        p:0
                    }}>
                        <Typography variant="h3">Category with maximum total </Typography>
                    </Container>
                    <TableContainer component={Paper}>
                        <TableRow>
                            <TableCell><Typography variant="h6">Name</Typography></TableCell>
                            <TableCell sx={{width: "10000px"}}>
                                <Typography component={Link} to={`/categories/${maxCategory?.id}`} variant="subtitle1" color="secondary" sx={{textDecoration: "none"}}>{maxCategory?.name}</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="h6">Total</Typography></TableCell>
                            <TableCell>
                                <Typography variant="subtitle1">{maxCategory?.total}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableContainer>
                </CardContent>
            </Card>}
        </Container>
    );
}