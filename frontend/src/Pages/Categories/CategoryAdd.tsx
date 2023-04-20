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

    const [nameError, setNameError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [userError, setUserError] = useState(false);

    const [nameText, setNameText] = useState("");
    const [descriptionText, setDescriptionText] = useState("");
    const [userText, setUserText] = useState("");

    const validate = () => {
        let valid = true;
        
        setNameError(false);
        setDescriptionError(false);
        setUserError(false);

        setNameText("");
        setDescriptionText("MAX 250 characters");
        setUserText("");
        
        if (!(/^[a-zA-Z ]+$/).test(name)) {
            setNameError(true);
            setNameText("Name must contain only letters and spaces.");
            valid = false;
        }
        if (description.length > 250) {
            setDescriptionError(true);
            setDescriptionText("Description must be less than 250 characters.");
            valid = false;
        }
        if (description.length == 0) {
            setDescriptionError(true);
            setDescriptionText("Description cannot be empty.");
            valid = false;
        }
        if (userId.length == 0) {
            setUserError(true);
            setUserText("You must select a user.")
            valid = false;
        }

        return valid;
    }

    const handleSubmit = async () => {
        const valid = validate();

        if (!valid) {
            return;
        }

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
                    onChange={e => {
                        setName(e.target.value);
                        setNameError(false);
                        setNameText("");
                    }}
                    error={nameError}
                    helperText={nameText}
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
                    onChange={e => {
                        setDescription(e.target.value);
                        setDescriptionError(false);
                        setDescriptionText("MAX 250 characters");
                    }}
                    error={descriptionError}
                    helperText={descriptionText}
                    value={description}
                    fullWidth
                    sx={{m: 2, width: "50ch"}}
                />
                <TextField
                    select
                    label="User"
                    required
                    onChange={e => {
                        setUserId(e.target.value);
                        setUserError(false);
                        setUserText("");
                    }}
                    error={userError}
                    helperText={userText}
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
