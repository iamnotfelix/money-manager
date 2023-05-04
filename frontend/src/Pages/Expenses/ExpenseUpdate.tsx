import { Grid, Paper } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../../Models/Category";
import { Expense } from "../../Models/Expense";
import { AutoComplete } from "../../Components/Forms/AutoComplete";
import { debounce } from "lodash";
import { useForm } from "../../Components/Forms/useForm";
import { FormHeader } from "../../Components/Forms/FormHeader";
import { FormComponent } from "../../Components/Forms/FormComponent";
import { InputComponent } from "../../Components/Forms/InputComponent";
import { SelectComponent } from "../../Components/Forms/SelectComponent";
import { FormButton } from "../../Components/Forms/FormButton";

const initialValues = {
    amount: 0,
    paymentType: "",
    description: "",
    currency: "",
    date: "2023-04-01",
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
    dateText: ""
}

const dateToString = (date: Date) => {
    const actualDate = new Date(date);
    var year = actualDate.getFullYear().toString();
    var month = (actualDate.getMonth() + 1).toString();
    var day = actualDate.getDate().toString();

    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }

    return year + "-" + month + "-" + day;
}

export const ExpenseUpdate = () => {
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
        const fetchExpense = async () => {
            const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/expenses/${params.id}`);
            const res = await data.json();
            const expense: Expense = res;
            const date = dateToString(expense.date);
            setValues({
                amount: expense.amount,
                paymentType: expense.paymentType,
                description: expense.description,
                currency: expense.currency,
                date: date,
                categories: expense.categories
            });
        }
        fetchExpense();
        setLoading(false);
    }, [params.id])

    const validate = () => {
        let valid = true;

        var errorsCopy = errors;
        if (values.amount < 0) {
            errorsCopy = {
                ...errorsCopy,
                amountError: true,
                amountText: "Amount cannot be negative."
            }
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
        if (values.description.length > 250 || values.description.length == 0) {
            errorsCopy = {
                ...errorsCopy,
                setDescriptionError: true,
                setDescriptionText: "Description must be between 1 and 250 characters."
            }
            valid = false;
        }
        setErrors(errorsCopy);

        return valid;
    }

    const fetchCategories = async (text: string, number: number) => {
        const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories/search?text=${text}&number=${number}`);
        const res = await data.json();
        setAllCategories(res);
    }

    const debouncedFetchCategories = debounce(async (text: string, number: number) => {
        await fetchCategories(text, number);
    }, 500);

    useEffect(() => {
		return () => {
			debouncedFetchCategories.cancel();
		};
	}, [debouncedFetchCategories]);


    const handleCategoryInputChange = (event: any, value: string, reason: any) => {
        if (reason === "input" && value.length > 0) {
			debouncedFetchCategories(value, 10);
		} 
    }

    const handleSubmit = async () => {
        const valid = validate();

        if (!valid) {
            return;
        }

        const body = {
            amount: values.amount,
            paymentType: values.paymentType,
            description: values.description,
            currency: values.currency,
            date: values.date,
            expenseCategories: values.categories.map((category: Category) => {
                return {
                    categoryId: category.id
                };
            })
        }
        const response = await window.fetch(import.meta.env.VITE_REACT_API_BACKEND + `/expenses/${params.id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'content-type': 'application/json',  
            },
            body: JSON.stringify(body)
        });

        navigate(`/expenses/${params.id}`);
    }

    return (
        <Paper sx={{m: "auto", width: "60%", mt: 4, p:3}}>
        {/* {loading && <Loading/>}
        {!loading && */}
        <FormHeader to="/expenses" title="Update expense" variant="h2"/>
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
                <Grid item xs={12}>
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
                        value={values.categories}
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
        </FormComponent>
        </Paper>
    );
}
