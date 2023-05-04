import { FormGroup, Grid, Paper } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../../Models/Category";
import { useForm } from "../../Components/Forms/useForm";
import { FormComponent } from "../../Components/Forms/FormComponent";
import { FormHeader } from "../../Components/Forms/FormHeader";
import { FormButton } from "../../Components/Forms/FormButton";
import { InputComponent } from "../../Components/Forms/InputComponent";

const initialValues = {
    name: "",
    description: ""
}

const initialErrorValues = {
    nameError: false,
    nameText: "",
    descriptionError: false,
    descriptionText: ""
}

export const CategoryUpdate = () => {
    const params = useParams();
    const navigate = useNavigate();

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleChange,
        handleInputChange
    } = useForm(initialValues, initialErrorValues);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const fetchCategory = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories/${params.id}`);
            const res = await data.json();
            const category: Category = res;
            setValues({
                name: category.name,
                description: category.description
            });
        }
        fetchCategory();
        setLoading(false);
    }, [params.id]);

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
        setErrors(errorsCopy);

        return valid;
    }

    const handleSubmit = async () => {
        const valid = validate();
        if (!valid) { return; }

        const body = {
            name: values.name,
            description: values.description
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
        <Paper sx={{m: "auto", width: "60%", mt: 4, p:3}}>
        {/* {loading && <Loading/>}
        {!loading && */}
        <FormHeader to="/categories" title="Update category" variant="h2"/>
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
                        <FormButton onClick={handleSubmit} text="Update"/>
                    </Grid>
                </Grid>
            </FormGroup>
        </FormComponent>
        </Paper>
    );
}
