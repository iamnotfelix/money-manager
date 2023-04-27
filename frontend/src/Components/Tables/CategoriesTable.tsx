import { Box } from '@mui/material';
import { Category } from '../../Models/Category';
import { useEffect, useState } from 'react';
import { useTableNavigator } from './useTableNavigator';
import { Loading } from '../Loading';
import { TableComponenet } from './TableComponent';
import { TableHeader } from './TableHeader';
import { TableContent } from './TableContent';
import { TableNavigator } from './TableNavigator';

const header = ["Index", "Name", "Description", "Total", "User", ""];
const contentKeys = ["name", "description", "total"];
const pageSize = 5;
const initialNavigatorValues = {
    pageSize: pageSize,
    next: "",
    previous: "",
    current: import.meta.env.VITE_REACT_API_BACKEND + `/categories/total?pageNumber=1&pageSize=${pageSize}`,
    previousDisabled: false,
    nextDisabled: false
}

export const CategoriesTable = () => {
    const [categories, setCategories] = useState<Category []>([]);
    
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
            const categoriesWithUsers: Category[] = await Promise.all(res.data.map(async (category: Category) => {
                const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/${category.userId}`);
                const user = await data.json();
                category.user = user;
                return category;
            }));
            setCategories(categoriesWithUsers);
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
                        content={categories}
                        contentKeys={contentKeys}
                        detailsLink="/categories"
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