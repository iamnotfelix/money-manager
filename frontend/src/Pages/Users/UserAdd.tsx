import { Box, Button, FormGroup, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const UserAdd = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const [usernameError, setUsernameError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [usernameText, setUsernameText] = useState("");
    const [nameText, setNameText] = useState("");
    const [emailText, setEmailText] = useState("");
    const [passwordText, setPasswordText] = useState("");

    const validate = () => {
        let valid = true;
        
        setUsernameError(false);
        setNameError(false);
        setEmailError(false);
        setPasswordError(false);

        setUsernameText("");
        setNameText("");
        setEmailText("");
        setPasswordText("");
        
        if (username.length == 0) {
            setUsernameError(true);
            setUsernameText("Username cannot be empty.");
            valid = false;
        }
        if (!(/^[a-zA-Z ]+$/).test(name)) {
            setNameError(true);
            setNameText("Name must contain only letters and spaces.");
            valid = false;
        }
        if (!(/^.*@.+$/).test(email)) {
            setEmailError(true);
            setEmailText("Email is not valid.");
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
    }

    return (
        <Box>
            <FormGroup sx={{ display: "flex", alignItems: "center"}}>
                <TextField
                    type="text"
                    variant='outlined'
                    color='primary'
                    label="Username"
                    onChange={e => {
                        setUsername(e.target.value);
                        setUsernameError(false);
                        setUsernameText("");
                    }}
                    error={usernameError}
                    helperText={usernameText}
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
                    label="Email"
                    onChange={e => {
                        setEmail(e.target.value);
                        setEmailError(false);
                        setEmailText("");
                    }}
                    error={emailError}
                    helperText={emailText}
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
                <Button variant="outlined" color="primary" type="submit" sx={{m: 4, width: "25ch"}} onClick={handleSubmit}>Add</Button>
            </FormGroup>
        </Box>
    );
}
