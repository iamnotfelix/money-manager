import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Container, IconButton, Stack, TextField, Typography, styled } from '@mui/material';
import { Expense } from '../../Models/Expense';
import { Link } from 'react-router-dom'
import CreateIcon from '@mui/icons-material/Create';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


export const ExpenseFilter = () => {
    const initExpenses: any[] = [];
    const [expenses, setExpenses] = useState(initExpenses);
    
    const [loading, setLoading] = useState(false);
    const [filterValue, setFilterValue] = useState(-1);

    const pageSize = 5;
	const [next, setNext] = useState("");
	const [previous, setPrevious] = useState("");
	const [current, setCurrent] = useState(import.meta.env.VITE_REACT_API_BACKEND + `/expenses/filter/-1?pageNumber=1&pageSize=${pageSize}`)
	const [previousDisabled, setPreviousDisabled] = useState(false);
	const [nextDisabled, setNextDisabled] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(current);
            const res = await data.json();
            const expensesWithUsers: Expense[] = await Promise.all(res.data.map(async (expense: Expense) => {
                const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/${expense.userId}`);
                const user = await data.json();
                expense.user = user;
                return expense;
            }));
            setExpenses(expensesWithUsers);
            const previousPage = res.previousPage ? res.previousPage : "";
			const nextPage = res.nextPage ? res.nextPage : "";
			setPrevious(previousPage);
			setNext(nextPage);
			setPreviousDisabled(previousPage.length > 0 ? false : true);
			setNextDisabled(nextPage.toString().length > 0 ? false : true);
        }
        fetchData();
        setLoading(false);
    }, [current]);

    useEffect(() => {
        setCurrent(import.meta.env.VITE_REACT_API_BACKEND + `/expenses/filter/${filterValue}?pageNumber=1&pageSize=${pageSize}`)
    }, [filterValue])

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(e.target.value == "" ? 0 : parseInt(e.target.value));
    }

    const handleClickPrevious = () => {
		setCurrent(previous);
	}

	const handleClickNext = () => {
		setCurrent(next);
	}

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
                        defaultValue={0}
                        onChange={handleNumberChange}
                    ></TextField>
                    <Link to={"/expenses/add"}>
                        <IconButton size="large">
                            <AddIcon fontSize="large"/>
                        </IconButton>
                    </Link>
                </Container>
            </Container>
            
            <Box width="1100px">
                {loading && <Stack alignItems="center" mt={4}><Typography variant="h3" gutterBottom>Still loading...</Typography></Stack>}
                {!loading &&
                <Box>
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
                                <TableCell align="left" key={"index" + index.toString()}>{index + 1}</TableCell>
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
                <Stack direction='row' justifyContent="center" m={4}>
                    <IconButton size="large" onClick={handleClickPrevious} disabled={previousDisabled}>
                        <KeyboardArrowLeftIcon fontSize="large"/>
                    </IconButton>
                    <IconButton size="large" onClick={handleClickNext} disabled={nextDisabled}>
                        <KeyboardArrowRightIcon fontSize="large"/>
                    </IconButton>
                </Stack>
                </Box>}
            </Box>
        </Container>
    );
}