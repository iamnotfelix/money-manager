import { Box, Button, FormGroup, MenuItem, Stack, TextField, Typography } from "@mui/material"
import * as React from 'react';
import { useState } from "react"
import { User } from "../../Models/User";
import { useNavigate } from "react-router-dom";

export const CategoryAdd = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [userId, setUserId] = useState("");

    const [loading, setLoading] = React.useState(false);
    const [users, setUsers] = useState([]);

    React.useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users`);
            const users = await data.json();
            setUsers(users);
        }

        fetchData();
        setLoading(false);
    }, [])

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const body = {
            name: name,
            description: description,
            userId: userId
        }

        const response = await window.fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify(body)
        });
        
        navigate("/categories");

        
        // //handle failure
    }

    return (
        <Box>
            {loading && <Stack alignItems="center" mt={4}><Typography variant="h3" gutterBottom>Still loading...</Typography></Stack>}
            {!loading &&
            <FormGroup sx={{ display: "flex", alignItems: "center"}}>
                <TextField
                    type="text"
                    variant='outlined'
                    color='primary'
                    label="Name"
                    onChange={e => setName(e.target.value)}
                    fullWidth
                    value={name}
                    required
                    sx={{m: 2, width: "25ch"}}
                />
                <TextField
                    type="text"
                    variant='outlined'
                    color='primary'
                    label="Description"
                    onChange={e => setDescription(e.target.value)}
                    value={description}
                    fullWidth
                    sx={{m: 2, width: "50ch"}}
                />
                <TextField
                    select
                    label="User"
                    required
                    onChange={e => setUserId(e.target.value)}
                    sx={{m: 2, width: "25ch"}}
                >
                    {users.map((option: User) => (
                        <MenuItem key={option.id} value={option.id}>
                        {option.username}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="outlined" color="primary" type="submit" sx={{m: 4, width: "25ch"}} onClick={handleSubmit}>Add</Button>
            </FormGroup>}
        </Box>
    );
}
