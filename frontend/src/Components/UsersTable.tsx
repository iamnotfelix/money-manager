import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, IconButton, Stack, Typography, styled } from '@mui/material';
import { User } from '../Models/User';
import { Link } from 'react-router-dom'
import CreateIcon from '@mui/icons-material/Create';
import { useState, useEffect } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


export const UsersTable = () => {
    const initUsers: any[] = [];
    const [users, setUsers] = useState(initUsers);

    const [loading, setLoading] = useState(false);

    const pageSize = 5;
	const [next, setNext] = useState("");
	const [previous, setPrevious] = useState("");
	const [current, setCurrent] = useState(import.meta.env.VITE_REACT_API_BACKEND + `/users/total?pageNumber=1&pageSize=${pageSize}`)
	const [previousDisabled, setPreviousDisabled] = useState(false);
	const [nextDisabled, setNextDisabled] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(current);
            const res = await data.json();
            setUsers(res.data);
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
                        <TableCell align="center">Username</TableCell>
                        <TableCell align="center">Total spent</TableCell>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {!loading && users.map((user: User, index) => (
                        <TableRow key={index}> 
                            <TableCell align="left" key={"index" + index.toString()}>{index + 1}</TableCell>
                            <TableCell align="center" key={"name" + index.toString()}>{user.name}</TableCell>
                            <TableCell align="center" key={"username" + index.toString()}>{user.username}</TableCell>
                            <TableCell align="center" key={"total" + index.toString()}>{user.totalSpent}</TableCell>
                            <TableCell>
                                <SimpleLink to={`/users/${user.id}`}><CreateIcon/></SimpleLink>
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