import { Box } from '@mui/material';
import { Expense } from '../../Models/Expense';
import { useState, useEffect } from 'react';
import { TableHeader } from './TableHeader';
import { TableContent } from './TableContent';
import { TableNavigator } from './TableNavigator';
import { useTableNavigator } from './useTableNavigator';
import { Loading } from '../Loading';
import { TableComponenet } from './TableComponent';

const header = ["Index", "Amount", "Payment type", "Description", "Currency", "Date", "Total categories", "User", ""];
const contentKeys = ["amount", "paymentType", "description", "currency", "date", "totalCategories"];
const pageSize = 5;
const initialNavigatorValues = {
    pageSize: pageSize,
    next: "",
    previous: "",
    current: import.meta.env.VITE_REACT_API_BACKEND + `/expenses/total?pageNumber=1&pageSize=${pageSize}`,
    previousDisabled: false,
    nextDisabled: false
}

export const ExpensesTable = () => {
    const [expenses, setExpenses] = useState<Expense []>([]);

    const [loading, setLoading] = useState(false);

    const {
        navigatorValues,
        handleClickNext,
        handleClickPrevious,
        handlePageChange
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

    return (
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
    );
}