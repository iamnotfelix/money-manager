import { Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { User } from "../../Models/User";
import { useNavigate } from "react-router-dom";
import { Category } from "../../Models/Category";
import { debounce } from "lodash";
import { AutoComplete } from "../../Components/Forms/AutoComplete"
import { useForm } from "../../Components/Forms/useForm";
import { FormComponent } from "../../Components/Forms/FormComponent";
import { InputComponent } from "../../Components/Forms/InputComponent";
import { SelectComponent } from "../../Components/Forms/SelectComponent";
import { FormButton } from "../../Components/Forms/FormButton";
import { FormHeader } from "../../Components/Forms/FormHeader";

const initialValues = {
    amount: 0,
    paymentType: "",
    description: "",
    currency: "",
    date: "2023-04-01",
    user: null,
    categories: []
}

const initialErrorValues = {
    amountError: false,
    amountText: "",
    paymentTypeError: false,
    paymentTypeText: "",
    descriptionError: false,
    descriptionText: "",
    currencyError: false,
    currencyText: "",
    dateError: false,
    dateText: "",
    userError: false,
    userText: ""
}

const currencies = [ { value: 'Lei', label: 'Lei' }, { value: 'Euro', label: 'Euro' } ];
const paymentTypes = [ { value:"Cash", label:"Cash" }, { value:"BT", label:"BT" }, { value:"Revolut", label:"Revolut" }, { value:"Alpha", label:"Alpha" } ];

export const ExpenseAdd = () => {
    const navigate = useNavigate();

    const {
        values,
        errors,
        setErrors,
        handleChange,
        handleInputChange
    } = useForm(initialValues, initialErrorValues);

    const [allUsers, setAllUsers] = useState<User []>([]);
    const [allCategories, setAllCategories] = useState<Category []>([]);

    const fetchCategories = async (text: string, number: number) => {
        const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories/search?text=${text}&number=${number}`);
        const res = await data.json();
        setAllCategories(res);
    }

    const fetchUsers = async (text: string, number: number) => {
        const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/search?text=${text}&number=${number}`);
        const res = await data.json();
        setAllUsers(res);
    }

    const debouncedFetchUsers = debounce(async (text: string, number: number) => {
        await fetchUsers(text, number);
    }, 500);
    
    const debouncedFetchCategories = debounce(async (text: string, number: number) => {
        await fetchCategories(text, number);
    }, 500);

	useEffect(() => {
		return () => {
			debouncedFetchUsers.cancel();
		};
	}, [debouncedFetchUsers]);

    useEffect(() => {
		return () => {
			debouncedFetchCategories.cancel();
		};
	}, [debouncedFetchCategories]);

    const handleUserInputChange = (event: any, value: string, reason: any) => {
		if (reason === "input" && value.length > 0) {
			debouncedFetchUsers(value, 10);
		} else if (reason === "input") {
            setAllUsers([]);
        }
	};

    const handleCategoryInputChange = (event: any, value: string, reason: any) => {
        if (reason === "input" && value.length > 0) {
			debouncedFetchCategories(value, 10);
		} 
    }

    const validate = () => {
        var valid = true;

        var errorsCopy = errors;
        if (values.amount == "" || values.amount < 0) {
            errorsCopy = {
                ...errorsCopy,
                amountError: true,
                amountText: "Amount cannot be negative."
            };
            valid = false;
        }
        if (values.paymentType.length == 0) {
            errorsCopy = {
                ...errorsCopy,
                paymentTypeError: true,
                paymentTypeText: "You have to choose a payment type."
            };
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
        const selectedDate = new Date(values.date);
        const minDate = new Date("2000-01-01");
        const maxDate = new Date("2100-01-01");
        if (selectedDate < minDate || selectedDate > maxDate) {
            errorsCopy = {
                ...errorsCopy,
                dateError: true,
                dateText: "Date out of permited range."
            };
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
        if (values.description.length > 250 || values.description.length == 0) {
            errorsCopy = {
                ...errorsCopy,
                descriptionError: true,
                descriptionText: "Description must be between 1 and 250 characters."
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
            amount: values.amount,
            paymentType: values.paymentType,
            description: values.description,
            currency: values.currency,
            userId: values.user!.id,
            date: values.date,
            expenseCategories: values.categories.map((category: Category) => {
                return {
                    categoryId: category.id
                };
            })
        }
        const response = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/expenses`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify(body)
        });
        
        navigate("/expenses");
    }

    return (

        <Paper sx={{m: "auto", width: "60%", mt: 4, p:3}}>
        <FormHeader to="/expenses" title="Add expense" variant="h2"/>
        <FormComponent>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                    <SelectComponent
                        label="Payment type"
                        name="paymentType"
                        onChange={handleChange}
                        onInput={handleInputChange}
                        error={errors.paymentTypeError}
                        helperText={errors.paymentTypeText}
                        value={values.paymentType}
                        options={paymentTypes}
                    />
                </Grid>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                    <InputComponent
                        type="date"
                        label="Date"
                        name="date"
                        onChange={handleChange}
                        onInput={handleInputChange}
                        error={errors.dateError}
                        helperText={errors.dateText}
                        value={values.date}
                    />
                </Grid>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                    <AutoComplete
                        multiple
                        options={allCategories}
                        getOptionLabel={(option: Category) => option.name}
                        label="Categories"
                        name="categories"
                        error={false}
                        helperText=""
                        onInputChange={handleCategoryInputChange}
                        onChange={handleChange}
                        onInput={handleInputChange}
                        filterOptions={(x: any) => x}
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
                    <FormButton onClick={handleSubmit} text="Add"/>
                </Grid>
            </Grid>
        </FormComponent>
        </Paper>
    );
}
