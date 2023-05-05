import { Card, CardActions, CardContent, Container, IconButton, Paper, Stack, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Income } from "../../Models/Income";
import { Category } from "../../Models/Category";


export const IncomeDetailed = () => {

    const [income, setIncome] = useState<Income>();
    const [loading, setLoading] = useState(false);

    const params = useParams();

    React.useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/incomes/${params.id}`);
            const res = await data.json();
            setIncome(res);
        }
        fetchData();
        setLoading(false);
    }, []);

    return (
            <Container>
                <Card>
                    <CardContent>
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/incomes`}>
                            <ArrowBackIcon fontSize="large"/>
                        </IconButton>
                        <Container sx={{
                            display: "flex",
                            gap: "10px",
                            mb: 2,
                            p:0
                        }}>
                            <Typography variant="h2">Income Details</Typography>
                            <CardActions>
                                <IconButton component={Link} sx={{ mr: 0 }} to={`/incomes/${params.id}/update`}>
                                    <EditIcon fontSize="large"/>
                                </IconButton>
            
                                <IconButton component={Link} sx={{ mr: 0 }} to={`/incomes/${params.id}/delete`}>
                                    <DeleteIcon sx={{ color: "red" }} fontSize="large"/>
                                </IconButton>
                            </CardActions>
                        </Container>
                        <TableContainer component={Paper}>
                            <TableRow>
                                <TableCell><Typography variant="h6">Name</Typography></TableCell>
                                <TableCell sx={{width: "10000px"}}><Typography variant="subtitle1">{income?.name}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6">Amount</Typography></TableCell>
                                <TableCell sx={{width: "10000px"}}><Typography variant="subtitle1">{income?.amount}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Typography variant="h6">Currency</Typography></TableCell>
                                <TableCell><Typography variant="subtitle1">{income?.currency}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">Comments</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1">{income?.comments}</Typography></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">User</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography component={Link} to={`/users/${income?.user.id}`} variant="subtitle1" color="secondary" sx={{textDecoration: "none"}}>{income?.user.username}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Container>
    );
}