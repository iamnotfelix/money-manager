import { Grid, Paper } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../../Models/Category";
import { Income } from "../../Models/Income";
import { AutoComplete } from "../../Components/Forms/AutoComplete";
import { debounce } from "lodash";
import { useForm } from "../../Components/Forms/useForm";
import { FormHeader } from "../../Components/Forms/FormHeader";
import { FormComponent } from "../../Components/Forms/FormComponent";
import { InputComponent } from "../../Components/Forms/InputComponent";
import { SelectComponent } from "../../Components/Forms/SelectComponent";
import { FormButton } from "../../Components/Forms/FormButton";

const initialValues = {
    name: "",
    amount: 0,
    currency: "",
    comments: ""
}

const initialErrorValues = {
    nameError: false,
    nameText: "",
    amountError: false,
    amountText: "",
    currencyError: false,
    currencyText: "",
    commentsError: false,
    commentsText: ""
}

const currencies = [ { value: 'Lei', label: 'Lei' }, { value: 'Euro', label: 'Euro' } ];

export const IncomeUpdate = () => {
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
    const [allCategories, setAllCategories] = useState([]);

    const currencies = [ { value: 'Lei', label: 'Lei' }, { value: 'Euro', label: 'Euro' } ];
    const paymentTypes = [ { value:"Cash", label:"Cash" }, { value:"BT", label:"BT" }, { value:"Revolut", label:"Revolut" }, { value:"Alpha", label:"Alpha" } ];


    useEffect(() => {
        setLoading(true);
        const fetchIncome = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/incomes/${params.id}`);
            const res = await data.json();
            const income: Income = res;
            setValues({
                name: income.name,
                amount: income.amount,
                currency: income.currency,
                comments: income.comments
            });
        }
        fetchIncome();
        setLoading(false);
    }, [params.id])

    const validate = () => {
        let valid = true;

        var errorsCopy = errors;
        if (values.name.length == 0) {
            errorsCopy = {
                ...errorsCopy,
                nameError: true,
                nameText: "Name cannot be empty."
            }
            valid = false;
        }
        if (values.amount == "" || values.amount < 0) {
            errorsCopy = {
                ...errorsCopy,
                amountError: true,
                amountText: "Amount cannot be negative."
            }
            valid = false;
        }
        if (values.currency.length == 0) {
            errorsCopy = {
                ...errorsCopy,
                currencyError: true,
                currencyText: "You have to choose a currency."
            };
            valid = false;
        }
        if (values.comments.length > 250 || values.comments.length == 0) {
            errorsCopy = {
                ...errorsCopy,
                commentsError: true,
                commentsText: "Description must be between 1 and 250 characters."
            }
            valid = false;
        }
        setErrors(errorsCopy);

        return valid;
    }

    const handleSubmit = async () => {
        const valid = validate();

        if (!valid) {
            return;
        }

        const body = {
            name: values.name,
            amount: values.amount,
            currency: values.currency,
            comments: values.comments
        }
        const response = await window.fetch(import.meta.env.VITE_REACT_API_BACKEND + `/incomes/${params.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify(body)
        });

        navigate(`/incomes/${params.id}`);
    }

    return (
        <Paper sx={{m: "auto", width: "60%", mt: 4, p:3}}>
        {/* {loading && <Loading/>}
        {!loading && */}
        <FormHeader to="/incomes" title="Update income" variant="h2"/>
        <FormComponent>
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
                        type="number"
                        label="Amount"
                        name="amount"
                        onChange={handleChange}
                        onInput={handleInputChange}
                        error={errors.amountError}
                        helperText={errors.amountText}
                        value={values.amount}
                    />
                </Grid>
                <Grid item xs={12}>
                    <SelectComponent
                        label="Currency"
                        name="currency"
                        onChange={handleChange}
                        onInput={handleInputChange}
                        error={errors.currencyError}
                        helperText={errors.currencyText}
                        value={values.currency}
                        options={currencies}
                    />
                </Grid>
                <Grid item xs={12}>
                    <InputComponent
                        label="Comments"
                        name="comments"
                        onChange={handleChange}
                        onInput={handleInputChange}
                        error={errors.commentsError}
                        helperText={errors.commentsText}
                        value={values.comments}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormButton onClick={handleSubmit} text="Update"/>
                </Grid>
            </Grid>
        </FormComponent>
        </Paper>
    );
}
