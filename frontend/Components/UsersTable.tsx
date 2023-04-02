import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { User } from '../Models/User';
import { Typography } from '@mui/material';


export const UsersTable = () => {
    const [loading, setLoading] = React.useState(false);
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5000/api/users")
            .then(data => data.json())
            .then(res => {
                setUsers(res);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            {loading && <Typography variant="h3" gutterBottom>Still loading...</Typography>}
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left">Index</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Username</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {!loading && users.map((user: User, index) => (
                        <TableRow key={index}> 
                            <TableCell align="left" key={"index" + index.toString()}>{index}</TableCell>
                            <TableCell align="center" key={"name" + index.toString()}>{user.name}</TableCell>
                            <TableCell align="center" key={"username" + index.toString()}>{user.username}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}