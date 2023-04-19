import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Stack, Typography, styled } from '@mui/material';
import { Category } from '../Models/Category';
import { Link } from 'react-router-dom'
import CreateIcon from '@mui/icons-material/Create';


export const CategoriesTable = () => {
    const initCategories: any[] = [];
    const [loading, setLoading] = React.useState(false);
    const [categories, setCategories] = React.useState(initCategories);

    React.useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories`);
            const categories = await data.json();
            const categoriesWithUsers: Category[] = await Promise.all(categories.map(async (category: Category) => {
                const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/${category.userId}`);
                const user = await data.json();
                const fullCategory: Category = category;
                fullCategory.user = user;
                return fullCategory;
            }));
            setCategories(categoriesWithUsers);
        }
        fetchData();
        setLoading(false);
    }, []);

    const SimpleLink = styled(Link) ({
        color: 'inherit',
        padding: 0,
        margin: 0,
        textDecoration: 'none'
    })


    return (
        <Box width="1100px">
            {loading && <Stack alignItems="center" mt={4}><Typography variant="h3" gutterBottom>Still loading...</Typography></Stack>}
            {!loading &&
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left">Index</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">User</TableCell>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {!loading && categories.map((category: Category, index) => (
                        <TableRow key={index}> 
                            <TableCell align="left" key={"index" + index.toString()}>{index}</TableCell>
                            <TableCell align="center" key={"name" + index.toString()}>{category.name}</TableCell>
                            <TableCell align="left" key={"description" + index.toString()}>{category.description}</TableCell>
                            <TableCell align="center" key={"username" + index.toString()}>
                                <SimpleLink to={`/users/${category.user.id}`}> <Typography color="secondary">{category.user.username}</Typography></SimpleLink>
                            </TableCell>
                            <TableCell>
                                <SimpleLink to={`/categories/${category.id}`}><CreateIcon/></SimpleLink>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>}
        </Box>
    );
}