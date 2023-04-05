import { Card, CardActions, CardContent, Container, IconButton, Paper, Stack, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Expense } from "../../Models/Expense";
import { Category } from "../../Models/Category";


export const ExpenseDetailed = () => {

    const [expense, setExpense] = useState<Expense>();
    const [loading, setLoading] = useState(false);

    const params = useParams();

    React.useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/expenses/${params.id}`);
            const res = await data.json();
            setExpense(res);
        }
        fetchData();
        setLoading(false);
    }, []);

    return (
            <Container>
                <Card>
                    <CardContent>
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/expenses`}>
                            <ArrowBackIcon fontSize="large"/>
                        </IconButton>
                        <Container sx={{
                            display: "flex",
                            gap: "10px",
                            mb: 2,
                            p:0
                        }}>
                            <Typography variant="h2">Expense Details</Typography>
                            <CardActions>
                                <IconButton component={Link} sx={{ mr: 0 }} to={`/expenses/${params.id}/update`}>
                                    <EditIcon fontSize="large"/>
                                </IconButton>
            
                                <IconButton component={Link} sx={{ mr: 0 }} to={`/expenses/${params.id}/delete`}>
                                    <DeleteIcon sx={{ color: "red" }} fontSize="large"/>
                                </IconButton>
                            </CardActions>
                        </Container>
                        <TableContainer component={Paper}>
                            <TableRow>
                                <TableCell><Typography variant="h6">Amount</Typography></TableCell>
                                <TableCell sx={{width: "10000px"}}><Typography variant="subtitle1">{expense?.amount}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6">Payment Type</Typography></TableCell>
                                <TableCell><Typography variant="subtitle1">{expense?.paymentType}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">Description</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1">{expense?.description}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">Currency</Typography>
                                </TableCell>
                                <TableCell><Typography variant="subtitle1">{expense?.currency}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">Date</Typography>
                                </TableCell>
                                <TableCell><Typography variant="subtitle1">{expense?.date.toString()}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">User</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography component={Link} to={`/users/${expense?.user.id}`} variant="subtitle1" color="secondary" sx={{textDecoration: "none"}}>{expense?.user.username}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">Categories</Typography>
                                </TableCell>
                                <TableCell>
                                    {expense?.categories.map((category: Category, index) => (
                                        <Typography key={index} component={Link} to={`/categories/${category.id}`} variant="subtitle1" color="secondary" sx={{textDecoration: "none", pr: 3}}>{category.name}</Typography>
                                    ))}
                                </TableCell>
                            </TableRow>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Container>
    );
}