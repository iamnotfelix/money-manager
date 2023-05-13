import { Card, CardActions, CardContent, Container, IconButton, Paper, Stack, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { User } from "../../Models/User";
import { Expense } from "../../Models/Expense";
import { Category } from "../../Models/Category";
import axios from "axios";
import { useAuth } from "../../Components/Hooks/useAuth";


export const UserDetailed = () => {
    const { auth } = useAuth();

    const navigate = useNavigate();

    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(false);

    const params = useParams();

    React.useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    import.meta.env.VITE_REACT_API_BACKEND + `/users/${params.id}`,  
                    {
                        headers: {
                            'content-type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                });
                setUser(response.data);
            } catch (e: any) {
                 // TODO: show server error message somewhere
                 console.log(e);
            }
            // const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/${params.id}`);
            // const res = await data.json();
            // setUser(res);
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
                    <IconButton sx={{ mr: 3 }} onClick={() => navigate(-1)}>
                        <ArrowBackIcon fontSize="large"/>
                    </IconButton>
                    <Container sx={{
                        display: "flex",
                        gap: "10px",
                        mb: 2,
                        p:0
                    }}>
                        <Typography variant="h2">User Profile</Typography>
                        <CardActions>
                            <IconButton component={Link} sx={{ mr: 0 }} to={`/users/${params.id}/update`}>
                                <EditIcon fontSize="large"/>
                            </IconButton>
        
                            <IconButton component={Link} sx={{ mr: 0 }} to={`/users/${params.id}/delete`}>
                                <DeleteIcon sx={{ color: "red" }} fontSize="large"/>
                            </IconButton>
                        </CardActions>
                    </Container>
                    <TableContainer component={Paper}>
                        <TableRow>
                            <TableCell><Typography variant="h6">Username</Typography></TableCell>
                            <TableCell sx={{width: "10000px"}}><Typography variant="subtitle1">{user?.username}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="h6">Email</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1">{user?.email}</Typography></TableCell>
                        </TableRow>
                        {user?.userProfile && 
                        <div>
                        <TableRow>
                            <TableCell><Typography variant="h6">Name</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1">{user?.userProfile.name}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="h6">Status</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1">{user?.userProfile.status}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="h6">Bio</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1">{user?.userProfile.bio}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="h6">Gender</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1">{user?.userProfile.gender}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="h6">Birthday</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1">{user?.userProfile.birthday.toString()}</Typography></TableCell>
                        </TableRow>
                        </div>}
                        <TableRow>
                            <TableCell><Typography variant="h6">Total expenses</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1">{user?.expenses.length}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="h6">Total categories</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1">{user?.categories.length}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="h6">Expenses</Typography></TableCell>
                            <TableCell>
                                {user?.expenses.map((expense: Expense, index) => (
                                    <Stack direction="row" key={index}>
                                        <Typography component={Link} to={`/expenses/${expense.id}`} variant="subtitle1" color="secondary" sx={{textDecoration: "none", pr: 3}}>{expense.amount}</Typography>
                                        <Typography component={Link} to={`/expenses/${expense.id}`} variant="subtitle1" color="secondary" sx={{textDecoration: "none", pr: 3}}>{expense.description}</Typography>
                                    </Stack>
                                ))}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="h6">Categories</Typography></TableCell>
                            <TableCell>
                                {user?.categories.map((category: Category, index) => (
                                    <Typography key={index} component={Link} to={`/categories/${category.id}`} variant="subtitle1" color="secondary" sx={{textDecoration: "none", pr: 3}}>{category.name}</Typography>
                                ))}
                            </TableCell>
                        </TableRow>
                    </TableContainer>
                </CardContent>
            </Card>}
        </Container>
    );
}