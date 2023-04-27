import { Box, Container, IconButton, TextField, Typography } from '@mui/material';
import { Expense } from '../../Models/Expense';
import { Link } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useTableNavigator } from '../../Components/Tables/useTableNavigator';
import { Loading } from '../../Components/Loading';
import { TableComponenet } from '../../Components/Tables/TableComponent';
import { TableContent } from '../../Components/Tables/TableContent';
import { TableHeader } from '../../Components/Tables/TableHeader';
import { TableNavigator } from '../../Components/Tables/TableNavigator';

const header = ["Index", "Amount", "Payment type", "Description", "Currency", "Date", "User", ""];
const contentKeys = ["amount", "paymentType", "description", "currency", "date"];
const pageSize = 5;
const initialNavigatorValues = {
    pageSize: pageSize,
    next: "",
    previous: "",
    current: import.meta.env.VITE_REACT_API_BACKEND + `/expenses/filter/-1?pageNumber=1&pageSize=${pageSize}`,
    previousDisabled: false,
    nextDisabled: false
}

export const ExpenseFilter = () => {
    const [expenses, setExpenses] = useState<Expense []>([]);
    
    const [loading, setLoading] = useState(false);
    const [filterValue, setFilterValue] = useState(-1);

    const {
        navigatorValues,
        handleClickNext,
        handleClickPrevious,
        handlePageChange,
        setCurrent
    } = useTableNavigator(initialNavigatorValues)

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(navigatorValues.current);
            const res = await data.json();
            const expensesWithUsers: Expense[] = await Promise.all(res.data.map(async (expense: Expense) => {
                const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/${expense.userId}`);
                const user = await data.json();
                expense.user = user;
                return expense;
            }));
            setExpenses(expensesWithUsers);
            handlePageChange(res);
        }
        fetchData();
        setLoading(false);
    }, [navigatorValues.current]);

    useEffect(() => {
        setCurrent(import.meta.env.VITE_REACT_API_BACKEND + `/expenses/filter/${filterValue}?pageNumber=1&pageSize=${pageSize}`)
    }, [filterValue])

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(e.target.value == "" ? 0 : parseInt(e.target.value));
    }

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
            
            <Box> 
                {loading && <Loading/>}
                {!loading &&
                <Box>
                    <TableComponenet>
                        <TableHeader
                            header={header}
                            />
                        <TableContent
                            content={expenses}
                            contentKeys={contentKeys}
                            detailsLink="/expenses"
                            hasUser={true}
                            >
                        </TableContent>
                    </TableComponenet>
                    <TableNavigator
                        handleClickPrevious={handleClickPrevious}
                        handleClickNext={handleClickNext}
                        previousDisabled={navigatorValues.previousDisabled}
                        nextDisabled={navigatorValues.nextDisabled}
                    />
                </Box>}
            </Box>
        </Container>
    );
}