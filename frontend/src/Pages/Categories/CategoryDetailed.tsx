import { Card, CardActions, CardContent, Container, IconButton, Paper, Stack, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Category } from "../../Models/Category";
import { Expense } from "../../Models/Expense";


export const CategoryDetailed = () => {

    const [category, setCategory] = useState<Category>();
    const [loading, setLoading] = useState(false);

    const params = useParams();

    React.useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories/${params.id}`);
            const res = await data.json();
            setCategory(res);
        }
        fetchData();
        setLoading(false);
    }, []);

    return (
            <Container>
                {loading && <Stack alignItems="center" mt={4}><Typography variant="h3" gutterBottom>Still loading...</Typography></Stack>}
                {!loading &&
                <Card>
                    <CardContent>
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/categories`}>
                            <ArrowBackIcon fontSize="large"/>
                        </IconButton>
                        <Container sx={{
                            display: "flex",
                            gap: "10px",
                            mb: 2,
                            p:0
                        }}>
                            <Typography variant="h2">Category Details</Typography>
                            <CardActions>
                                <IconButton component={Link} sx={{ mr: 0 }} to={`/categories/${params.id}/update`}>
                                    <EditIcon fontSize="large"/>
                                </IconButton>
            
                                <IconButton component={Link} sx={{ mr: 0 }} to={`/categories/${params.id}/delete`}>
                                    <DeleteIcon sx={{ color: "red" }} fontSize="large"/>
                                </IconButton>
                            </CardActions>
                        </Container>
                        <TableContainer component={Paper}>
                            <TableRow>
                                <TableCell><Typography variant="h6">Name</Typography></TableCell>
                                <TableCell sx={{width: "10000px"}}><Typography variant="subtitle1">{category?.name}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">Description</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1">{category?.description}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">User</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography component={Link} to={`/users/${category?.user.id}`} variant="subtitle1" color="secondary" sx={{textDecoration: "none"}}>{category?.user.username}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">Expenses</Typography>
                                </TableCell>
                                <TableCell>
                                    {category?.expenses.map((expense: Expense, index) => (
                                        <Stack direction="row" key={index}>
                                            <Typography component={Link} to={`/expenses/${expense.id}`} variant="subtitle1" color="secondary" sx={{textDecoration: "none", pr: 3}}>{expense.amount}</Typography>
                                            <Typography component={Link} to={`/expenses/${expense.id}`} variant="subtitle1" color="secondary" sx={{textDecoration: "none", pr: 3}}>{expense.description}</Typography>
                                        </Stack>
                                    ))}
                                </TableCell>
                            </TableRow>
                        </TableContainer>
                    </CardContent>
                </Card>}
            </Container>
    );
}