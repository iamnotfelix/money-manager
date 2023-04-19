import { Box, Button, FormGroup, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom";

export const UserUpdate = () => {
    const params = useParams();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const body = {
            name: name,
            password: password
        }

        const response = await window.fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/${params.id}`, {
            method: 'PUT',
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
                    label="Name"
                    onChange={e => setName(e.target.value)}
                    fullWidth
                    value={name}
                    required
                    sx={{m: 2, width: "25ch"}}
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
                <Button variant="outlined" color="primary" type="submit" sx={{m: 4, width: "25ch"}} onClick={handleSubmit}>Update</Button>
            </FormGroup>
        </Box>
    );
}
