import { Box, Button, FormGroup, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { User } from "../../Models/User";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { AutoComplete } from "../../Components/Inputs/AutoComplete";

export const CategoryAdd = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [user, setUser] = useState<User | null>();

    const [users, setUsers] = useState([]);

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
        if (user == null) {
            setUserError(true);
            setUserText("You must select a user.")
            valid = false;
        }

        return valid;
    }

    const fetchUsers = async (text: string, number: number) => {
        const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/search?text=${text}&number=${number}`);
        const res = await data.json();
        setUsers(res);
    }

    const debouncedFetchUsers = debounce(async (text: string, number: number) => {
        await fetchUsers(text, number);
    }, 500);
    

	useEffect(() => {
		return () => {
			debouncedFetchUsers.cancel();
		};
	}, [debouncedFetchUsers]);

    const handleUserInputChange = (event: any, value: string, reason: any) => {
		if (reason === "input" && value.length > 0) {
			debouncedFetchUsers(value, 10);
		} else if (reason === "input") {
            setUsers([]);
        }
	};

    const handleSubmit = async () => {
        const valid = validate();

        if (!valid) {
            return;
        }

        const body = {
            name: name,
            description: description,
            userId: user!.id
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
                <AutoComplete
                    options={users}
                    getOptionLabel={(option: User) => option.username}
                    label="User"
                    error={userError}
                    helperText={userText}
                    onInputChange={handleUserInputChange}
                    onChange={(e: any, value: any) => {
                        setUser(value);
                        setUserError(false);
                        setUserText("");
                    }}
                    filterOptions={(x: any) => x}
                    sx={{m: 2, width: "25ch"}}
                />
                {/* <TextField
                    select
                    label="User"
                    required
                    onChange={e => {
                        setUser(e.target.value);
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
                </TextField> */}
                <Button variant="outlined" color="primary" type="submit" sx={{m: 4, width: "25ch"}} onClick={handleSubmit}>Add</Button>
            </FormGroup>
        </Box>
    );
}
