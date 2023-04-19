import { Box, Button, FormGroup, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const UserAdd = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const body = {
            username: username,
            name: name,
            email: email,
            password: password
        }

        const response = await window.fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify(body)
        });
        
        navigate("/users");

        // //handle failure
    }

    return (
        <Box>
            <FormGroup sx={{ display: "flex", alignItems: "center"}}>
                <TextField
                    type="text"
                    variant='outlined'
                    color='primary'
                    label="Username"
                    onChange={e => setUsername(e.target.value)}
                    fullWidth
                    value={username}
                    required
                    sx={{m: 2, width: "25ch"}}
                />
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
                    label="Email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    fullWidth
                    required
                    sx={{m: 2, width: "50ch"}}
                />
                <TextField
                    type="password"
                    variant='outlined'
                    color='primary'
                    label="Password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    fullWidth
                    required
                    sx={{m: 2, width: "50ch"}}
                />
                <Button variant="outlined" color="primary" type="submit" sx={{m: 4, width: "25ch"}} onClick={handleSubmit}>Add</Button>
            </FormGroup>
        </Box>
    );
}
