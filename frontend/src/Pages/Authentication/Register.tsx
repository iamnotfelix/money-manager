import { Alert, AlertTitle, FormGroup, Grid, Paper } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useForm } from "../../Components/Forms/useForm";
import { FormComponent } from "../../Components/Forms/FormComponent";
import { FormHeader } from "../../Components/Forms/FormHeader";
import { InputComponent } from "../../Components/Forms/InputComponent";
import { FormButton } from "../../Components/Forms/FormButton";
import { useAuth } from "../../Components/Hooks/useAuth";
import { useState } from "react";
import axios from "../../Components/Auth/axios";

const initialValues = {
    username: "",
    email: "",
    password: ""
}

const initialErrorValues = {
    usernameError: false,
    usernameText: "",
    emailError: false,
    emailText: "",
    passwordError: false,
    passwordText: ""
}

export const Register = () => {
    const navigate = useNavigate();

    // const location = useLocation();
    // const from = location.state?.from?.pathname || '/';
    const { setAuth } = useAuth();

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleChange,
        handleInputChange
    } = useForm(initialValues, initialErrorValues);

    const [activationToken, setActivationToken] = useState<string | null>(null);

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
        if (values.email.length == 0) {
            errorsCopy = {
                ...errorsCopy,
                emailError: true,
                emailText: "You have to enter an email."
            };
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
            email: values.email,
            password: values.password
        }

        try {
            const response = await axios.post(
                `/auth/register`, 
                JSON.stringify(body), 
                {
                    headers: {
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            setValues(initialValues);
            setActivationToken(response.data);

            // navigate(from, { replace: true });
        } catch (e: any) {
            // TODO: show server error message somewhere on the form
            console.log(e);
        }

        // const response = await window.fetch(import.meta.env.VITE_REACT_API_BACKEND + `/auth/register`, {
        //     method: 'POST',
        //     mode: 'cors',
        //     headers: {
        //         'content-type': 'application/json',  
        //     },
        //     body: JSON.stringify(body)
        // });
        
        // navigate("/");
    }

    return (
        <Paper sx={{m: "auto", width: "60%", mt: 4, p:3}}>
        <FormHeader to="/" title="Register" variant="h2"/>
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
                            label="Email"
                            name="email"
                            onChange={handleChange}
                            onInput={handleInputChange}
                            error={errors.emailError}
                            helperText={errors.emailText}
                            value={values.email}
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
                        <FormButton onClick={handleSubmit} text="Register"/>
                    </Grid>
                    {activationToken 
                        ? <Grid item xs={12}>
                            <Alert severity="info">
                                <AlertTitle>Activation Token</AlertTitle>
                                {activationToken}
                            </Alert>
                        </Grid>
                        : <div></div>
                    }
                </Grid>
            </FormGroup>
        </FormComponent>
        </Paper>
    );
}
