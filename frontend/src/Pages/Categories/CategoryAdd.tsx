import { FormGroup, Grid, Paper } from "@mui/material"
import { useEffect, useState } from "react"
import { User } from "../../Models/User";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { AutoComplete } from "../../Components/Forms/AutoComplete";
import { useForm } from "../../Components/Forms/useForm";
import { FormComponent } from "../../Components/Forms/FormComponent";
import { FormHeader } from "../../Components/Forms/FormHeader";
import { InputComponent } from "../../Components/Forms/InputComponent";
import { FormButton } from "../../Components/Forms/FormButton";

const initialValues = {
    name: "",
    description: "",
    user: null
}

const initialErrorValues = {
    nameError: false,
    nameText: "",
    descriptionError: false,
    descriptionText: "",
    userError: false,
    userText: ""
}

export const CategoryAdd = () => {
    const navigate = useNavigate();

    const {
        values,
        errors,
        setErrors,
        handleChange,
        handleInputChange
    } = useForm(initialValues, initialErrorValues);

    const [allUsers, setAllUsers] = useState([]);

    const fetchUsers = async (text: string, number: number) => {
        const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/search?text=${text}&number=${number}`);
        const res = await data.json();
        setAllUsers(res);
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
            setAllUsers([]);
        }
	};

    const validate = () => {
        let valid = true;
        
        var errorsCopy = errors;
        if (!(/^[a-zA-Z ]+$/).test(values.name)) {
            errorsCopy = {
                ...errorsCopy,
                nameError: true,
                nameText: "Name must contain only letters and spaces."
            }
            valid = false;
        }
        if (values.description.length > 250 || values.description.length == 0) {
            errorsCopy = {
                ...errorsCopy,
                descriptionError: true,
                descriptionText: "Description must be between 1 and 250 characters."
            }
            valid = false;
        }
        if (values.user == null) {
            errorsCopy = {
                ...errorsCopy,
                userError: true,
                userText: "You must select a user."
            };
            valid = false;
        }
        setErrors(errorsCopy);

        return valid;
    }

    const handleSubmit = async () => {
        const valid = validate();
        if (!valid) { return; }

        const body = {
            name: values.name,
            description: values.description,
            userId: values.user!.id
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
        <Paper sx={{m: "auto", width: "60%", mt: 4, p:3}}>
        <FormHeader to="/categories" title="Add category" variant="h2"/>
        <FormComponent>
            <FormGroup sx={{ display: "flex", alignItems: "center"}}>
                <Grid container spacing={3} alignItems="center" justifyContent="center">
                    <Grid item xs={12}>
                        <InputComponent
                            label="Name"
                            name="name"
                            onChange={handleChange}
                            onInput={handleInputChange}
                            error={errors.nameError}
                            helperText={errors.nameText}
                            value={values.name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputComponent
                            label="Description"
                            name="description"
                            onChange={handleChange}
                            onInput={handleInputChange}
                            error={errors.descriptionError}
                            helperText={errors.descriptionText}
                            value={values.description}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <AutoComplete
                            options={allUsers}
                            getOptionLabel={(option: User) => option.username}
                            label="User"
                            name="user"
                            error={errors.userError}
                            helperText={errors.userText}
                            onInputChange={handleUserInputChange}
                            onChange={handleChange}
                            onInput={handleInputChange}
                            filterOptions={(x: any) => x}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormButton onClick={handleSubmit} text="Add"/>
                    </Grid>
                </Grid>
            </FormGroup>
        </FormComponent>
        </Paper>
    );
}
