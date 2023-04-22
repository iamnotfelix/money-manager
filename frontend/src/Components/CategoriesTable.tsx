import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, IconButton, Stack, Typography, styled } from '@mui/material';
import { Category } from '../Models/Category';
import { Link } from 'react-router-dom'
import CreateIcon from '@mui/icons-material/Create';
import { useEffect, useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


export const CategoriesTable = () => {
    const initCategories: any[] = [];
    const [categories, setCategories] = useState(initCategories);
    
    const [loading, setLoading] = useState(false);

    const pageSize = 5;
	const [next, setNext] = useState("");
	const [previous, setPrevious] = useState("");
	const [current, setCurrent] = useState(import.meta.env.VITE_REACT_API_BACKEND + `/categories/total?pageNumber=1&pageSize=${pageSize}`)
	const [previousDisabled, setPreviousDisabled] = useState(false);
	const [nextDisabled, setNextDisabled] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(current);
            const res = await data.json();
            const categoriesWithUsers: Category[] = await Promise.all(res.data.map(async (category: Category) => {
                const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/${category.userId}`);
                const user = await data.json();
                category.user = user;
                return category;
            }));
            setCategories(categoriesWithUsers);
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
        <Box width="1100px">
            {loading && <Stack alignItems="center" mt={4}><Typography variant="h3" gutterBottom>Still loading...</Typography></Stack>}
            {!loading &&
            <Box>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left">Index</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Total</TableCell>
                        <TableCell align="center">User</TableCell>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {!loading && categories.map((category: Category, index) => (
                        <TableRow key={index}> 
                            <TableCell align="left" key={"index" + index.toString()}>{index + 1}</TableCell>
                            <TableCell align="center" key={"name" + index.toString()}>{category.name}</TableCell>
                            <TableCell align="left" key={"description" + index.toString()}>{category.description}</TableCell>
                            <TableCell align="center" key={"total" + index.toString()}>{category.total}</TableCell>
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
    );
}