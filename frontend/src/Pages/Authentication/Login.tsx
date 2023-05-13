import { FormGroup, Grid, Paper } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "../../Components/Forms/useForm";
import { FormComponent } from "../../Components/Forms/FormComponent";
import { FormHeader } from "../../Components/Forms/FormHeader";
import { InputComponent } from "../../Components/Forms/InputComponent";
import { FormButton } from "../../Components/Forms/FormButton";
import axios from "../../Components/Auth/axios";
import { useAuth } from "../../Components/Hooks/useAuth";

const initialValues = {
    username: "",
    password: ""
}

const initialErrorValues = {
    usernameError: false,
    usernameText: "",
    passwordError: false,
    passwordText: ""
}

export const Login = () => {
    const navigate = useNavigate();
    
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const { setAuth } = useAuth();

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleChange,
        handleInputChange
    } = useForm(initialValues, initialErrorValues);

    const validate = () => {
        let valid = true;
        
        var errorsCopy = errors;
        if (values.username.length == 0) {
            errorsCopy = {
                ...errorsCopy,
                usernameError: true,
                usernameText: "You have to enter a username."
            }
            valid = false;
        }
        if (values.password.length == 0) {
            errorsCopy = {
                ...errorsCopy,
                passwordError: true,
                passwordText: "You have to enter an password."
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
            username: values.username,
            password: values.password
        }

        try {
            const response = await axios.post(
                `/auth/login`, 
                JSON.stringify(body), 
                {
                    headers: {
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            setValues(initialValues);
            setAuth({
                token: response.data.token,
                userId: response.data.data.id,
                roles: response.data.data.roles.split(",")
            })

            navigate(from, { replace: true });
        } catch (e: any) {
            // TODO: show server error message somewhere on the form
            console.log(e);
        }
    }

    return (
        <Paper sx={{m: "auto", width: "60%", mt: 4, p:3}}>
        <FormHeader to="/" title="Login" variant="h2"/>
        <FormComponent>
            <FormGroup sx={{ display: "flex", alignItems: "center"}}>
                <Grid container spacing={3} alignItems="center" justifyContent="center">
                    <Grid item xs={12}>
                        <InputComponent
                            label="Username"
                            name="username"
                            onChange={handleChange}
                            onInput={handleInputChange}
                            error={errors.usernameError}
                            helperText={errors.usernameText}
                            value={values.username}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputComponent
                            type="password"
                            label="Password"
                            name="password"
                            onChange={handleChange}
                            onInput={handleInputChange}
                            error={errors.passwordError}
                            helperText={errors.passwordText}
                            value={values.password}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormButton onClick={handleSubmit} text="Login"/>
                    </Grid>
                </Grid>
            </FormGroup>
        </FormComponent>
        </Paper>
    );
}
