import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Typography, styled } from '@mui/material';
import { Expense } from '../Models/Expense';
import { Link } from 'react-router-dom'
import CreateIcon from '@mui/icons-material/Create';
import FilterListIcon from '@mui/icons-material/FilterList';


export const ExpensesTable = () => {
    const initExpenses: any[] = [];
    const [loading, setLoading] = React.useState(false);
    const [expenses, setExpenses] = React.useState(initExpenses);
    const [sort, setSort] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/expenses`);
            const expenses = await data.json();
            const expensesWithUsers: Expense[] = await Promise.all(expenses.map(async (expense: Expense) => {
                const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/${expense.userId}`);
                const user = await data.json();
                const fullExpense: Expense = expense;
                fullExpense.user = user;
                const date: Date = fullExpense.date;
                return fullExpense;
            }));
            
            if (sort) {
                let sortedArray = expensesWithUsers;
                for (let i = 0; i < sortedArray.length - 1; ++i) {
                    let min = i;
                    for (let j = i + 1; j < sortedArray.length; ++j) {
                        if (sortedArray[j].amount < sortedArray[min].amount) {
                            min=j; 
                        }
                    }
                    if (min != i) {
                        let tmp = sortedArray[i]; 
                        sortedArray[i] = sortedArray[min];
                        sortedArray[min] = tmp;      
                   }
                }
                setExpenses(sortedArray);
            } else {
                setExpenses(expensesWithUsers);
            }
        }
        fetchData();
        setLoading(false);
    }, [sort]);

    const SimpleLink = styled(Link) ({
        color: 'inherit',
        padding: 0,
        margin: 0,
        textDecoration: 'none'
    })

    const handleClick = () => {
        setSort(!sort);
    }

    return (
        <Box width="1100px">
            {loading && <Typography variant="h3" gutterBottom>Still loading...</Typography>}
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left">Index</TableCell>
                        <TableCell align="center">
                            <Button onClick={handleClick}><FilterListIcon/></Button>
                            Amount
                        </TableCell>
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
    );
}