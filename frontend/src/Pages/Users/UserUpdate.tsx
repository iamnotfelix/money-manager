import { Box, Button, FormGroup, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../Models/User";

export const UserUpdate = () => {
    const params = useParams();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const fetchUser = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/${params.id}`);
            const res = await data.json();
            const user: User = res;
            setName(user.name);
            console.log(name);
        }

        fetchUser();

        setLoading(false);
    }, [params.id]);

    const navigate = useNavigate();

    const [nameError, setNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [nameText, setNameText] = useState("");
    const [passwordText, setPasswordText] = useState("");

    const validate = () => {
        let valid = true;
        
        setNameError(false);
        setPasswordError(false);

        setNameText("");
        setPasswordText("");
        
        if (!(/^[a-zA-Z ]+$/).test(name)) {
            setNameError(true);
            setNameText("Name must contain only letters and spaces.");
            valid = false;
        }
        if (password.length < 8) {
            setPasswordError(true);
            setPasswordText("Password must be at least 8 characters long.");
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
                    type="password"
                    variant='outlined'
                    color='primary'
                    label="Password"
                    onChange={e => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                        setPasswordText("");
                    }}
                    error={passwordError}
                    helperText={passwordText}
                    value={password}
                    fullWidth
                    required
                    sx={{m: 2, width: "50ch"}}
                />
                <Button variant="outlined" color="primary" type="submit" sx={{m: 4, width: "25ch"}} onClick={handleSubmit}>Update</Button>
            </FormGroup>}
        </Box>
    );
}
