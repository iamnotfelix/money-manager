import { Box } from '@mui/material';
import { Income } from '../../Models/Income';
import { useState, useEffect } from 'react';
import { useTableNavigator } from './useTableNavigator';
import { Loading } from '../Loading';
import { TableComponenet } from './TableComponent';
import { TableContent } from './TableContent';
import { TableHeader } from './TableHeader';
import { TableNavigator } from './TableNavigator';

const header = ["Index", "Name", "Amount", "Currency", "Comments", "Total Expenses", "User", ""];
const contentKeys = ["name", "amount", "currency", "comments", "totalExpenses"];
const pageSize = 5;
const initialNavigatorValues = {
    pageSize: pageSize,
    next: "",
    previous: "",
    current: import.meta.env.VITE_REACT_API_BACKEND + `/incomes/total?pageNumber=1&pageSize=${pageSize}`,
    previousDisabled: false,
    nextDisabled: false
}

export const IncomesTable = () => {
    const [incomes, setIncomes] = useState<Income []>([]);

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
            const incomesWithUsers: Income[] = await Promise.all(res.data.map(async (income: Income) => {
                const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/${income.userId}`);
                const user = await data.json();
                income.user = user;
                return income;
            }));
            setIncomes(incomesWithUsers);
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
                        content={incomes}
                        contentKeys={contentKeys}
                        detailsLink="/incomes"
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