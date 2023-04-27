import { Box } from '@mui/material';
import { User } from '../../Models/User';
import { useState, useEffect } from 'react';
import { useTableNavigator } from './useTableNavigator';
import { Loading } from '../Loading';
import { TableComponenet } from './TableComponent';
import { TableContent } from './TableContent';
import { TableHeader } from './TableHeader';
import { TableNavigator } from './TableNavigator';

const header = ["Index", "Name", "Username", "Total spent", ""];
const contentKeys = ["name", "username", "totalSpent"];
const pageSize = 5;
const initialNavigatorValues = {
    pageSize: pageSize,
    next: "",
    previous: "",
    current: import.meta.env.VITE_REACT_API_BACKEND + `/users/total?pageNumber=1&pageSize=${pageSize}`,
    previousDisabled: false,
    nextDisabled: false
}

export const UsersTable = () => {
    const [users, setUsers] = useState<User []>([]);

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
            setUsers(res.data);
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
                        content={users}
                        contentKeys={contentKeys}
                        detailsLink="/users"
                        hasUser={false}
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