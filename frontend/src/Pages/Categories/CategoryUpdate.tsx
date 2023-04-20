import { Box, Button, FormGroup, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../../Models/Category";

export const CategoryUpdate = () => {
    const params = useParams();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const fetchCategory = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories/${params.id}`);
            const res = await data.json();
            const category: Category = res;
            setName(category.name);
            setDescription(category.description);
        }

        fetchCategory();

        setLoading(false);
    }, [params.id]);

    const navigate = useNavigate();

    const [nameError, setNameError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);

    const [nameText, setNameText] = useState("");
    const [descriptionText, setDescriptionText] = useState("MAX 250 characters");

    const validate = () => {
        let valid = true;
        
        setNameError(false);
        setDescriptionError(false);

        setNameText("");
        setDescriptionText("MAX 250 characters");
        
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

        return valid;
    }

    const handleSubmit = async () => {
        const body = {
            name: name,
            description: description
        }

        const response = await window.fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories/${params.id}`, {
            method: 'PUT',
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
                <Button variant="outlined" color="primary" type="submit" sx={{m: 4, width: "25ch"}} onClick={handleSubmit}>Update</Button>
            </FormGroup>}
        </Box>
    );
}
