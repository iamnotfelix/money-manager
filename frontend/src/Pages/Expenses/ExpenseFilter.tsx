import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Container, IconButton, TextField, Typography, styled } from '@mui/material';
import { Expense } from '../../Models/Expense';
import { Link } from 'react-router-dom'
import CreateIcon from '@mui/icons-material/Create';
import AddIcon from '@mui/icons-material/Add';


export const ExpenseFilter = () => {
    const initExpenses: any[] = [];
    const [loading, setLoading] = React.useState(false);
    const [expenses, setExpenses] = React.useState(initExpenses);
    const [filterValue, setFilterValue] = React.useState(-1);


    React.useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/api/expenses/filter/${filterValue}`);
            const expenses = await data.json();
            const expensesWithUsers: Expense[] = await Promise.all(expenses.map(async (expense: Expense) => {
                const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/api/users/${expense.userId}`);
                const user = await data.json();
                const fullExpense: Expense = expense;
                fullExpense.user = user;
                const date: Date = fullExpense.date;
                return fullExpense;
            }));

            setExpenses(expensesWithUsers);
        }
        fetchData();
        setLoading(false);
    }, [filterValue]);

    const SimpleLink = styled(Link) ({
        color: 'inherit',
        padding: 0,
        margin: 0,
        textDecoration: 'none'
    })

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
                <Container sx={{
                    display: "flex",
                    flexDirection:"row",
                    justifyContent:"flex-end",
                    alignItems:"center",
                    m: 2
                }}>
                    <TextField
                        type="number"
                        variant="outlined"
                        color="primary"
                        label="Filter Amount"
                        onChange={e => setFilterValue(parseInt(e.target.value))}
                    ></TextField>
                    <Link to={"/expenses/add"}>
                        <IconButton size="large">
                            <AddIcon fontSize="large"/>
                        </IconButton>
                    </Link>
                </Container>
            </Container>
            
            <Box width="1100px">
                {loading && <Typography variant="h3" gutterBottom>Still loading...</Typography>}
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left">Index</TableCell>
                            <TableCell align="center">Amount</TableCell>
                            <TableCell align="center">Payment Type</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Currency</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">User</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {!loading && expenses.map((expense: Expense, index) => (
                            <TableRow key={index}> 
                                <TableCell align="left" key={"index" + index.toString()}>{index}</TableCell>
                                <TableCell align="center" key={"amount" + index.toString()}>{expense.amount}</TableCell>
                                <TableCell align="center" key={"paymentType" + index.toString()}>{expense.paymentType}</TableCell>
                                <TableCell align="left" key={"description" + index.toString()}>{expense.description}</TableCell>
                                <TableCell align="center" key={"currency" + index.toString()}>{expense.currency}</TableCell>
                                <TableCell align="center" key={"date" + index.toString()}>{expense.date.toString()}</TableCell>
                                <TableCell align="center" key={"username" + index.toString()}>
                                    <SimpleLink to={`/users/${expense.user.id}`}> <Typography color="secondary">{expense.user.username}</Typography></SimpleLink>
                                </TableCell>
                                <TableCell>
                                    <SimpleLink to={`/expenses/${expense.id}`}><CreateIcon/></SimpleLink>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}