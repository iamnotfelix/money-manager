import { Box, Button, FormGroup, MenuItem, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { User } from "../../Models/User";
import { useNavigate } from "react-router-dom";
import { Category } from "../../Models/Category";
import { debounce } from "lodash"
import { AutoComplete } from "../../Components/Inputs/AutoComplete"

export const ExpenseAdd = () => {
    const [amount, setAmount] = useState(0);
    const [paymentType, setPaymentType] = useState("Revolut");
    const [description, setDescription] = useState("");
    const [currency, setCurrency] = useState("Lei");
    const [date, setDate] = useState<Dayjs | null>(dayjs('2023-01-1'));
    const [user, setUser] = useState<User | null>(null);
    const [categories, setCategories] = useState<Category []>([]);

    const [users, setUsers] = useState<User []>([]);
    const [allCategories, setAllCategories] = useState<Category []>([]);

    const currencies = [ { value: 'Lei', label: 'Lei' }, { value: 'Euro', label: 'Euro' } ];
    const paymentTypes = [ { value:"Cash", label:"Cash" }, { value:"BT", label:"BT" }, { value:"Revolut", label:"Revolut" }, { value:"Alpha", label:"Alpha" } ];

    const navigate = useNavigate();

    const [amountError, setAmountError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [userError, setUserError] = useState(false);

    const [amountText, setAmountText] = useState("");
    const [descriptionText, setDescriptionText] = useState("");
    const [dateText, setDateText] = useState("");
    const [userText, setUserText] = useState("");

    const validate = () => {
        let valid = true;
        
        setAmountError(false);
        setDescriptionError(false);
        setDateError(false);
        setUserError(false);

        setAmountText("");
        setDescriptionText("MAX 250 characters");
        setDateText("");
        setUserText("");
        
        if (amount < 0) {
            setAmountError(true);
            setAmountText("Amount cannot be negative.");
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

    const fetchCategories = async (text: string, number: number) => {
        const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/categories/search?text=${text}&number=${number}`);
        const res = await data.json();
        setAllCategories(res);
    }

    const fetchUsers = async (text: string, number: number) => {
        const data = await fetch(import.meta.env.VITE_REACT_API_BACKEND + `/users/search?text=${text}&number=${number}`);
        const res = await data.json();
        setUsers(res);
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
            setUsers([]);
        }
	};

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
            amount: amount,
            paymentType: paymentType,
            description: description,
            currency: currency,
            userId: user!.id,
            date: date,
            expenseCategories: categories.map((category: Category) => {
                return {
                    categoryId: category.id
                };
            })
        }

        const response = await window.fetch(import.meta.env.VITE_REACT_API_BACKEND + `/expenses`, {
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
        <Box>
            <FormGroup sx={{ display: "flex", alignItems: "center"}}>
                <TextField
                    variant='outlined'
                    type="number"
                    label="Amount"
                    color='primary'
                    onChange={e => {
                        setAmount(parseInt(e.target.value));
                        setAmountError(false);
                        setAmountText("");
                    }}
                    error={amountError}
                    helperText={amountText}
                    fullWidth
                    value={amount}
                    required
                    sx={{m: 2, width: "25ch"}}
                />
                <TextField
                    select
                    label="Payment type"
                    defaultValue="Revolut"
                    helperText="Please select your payment type"
                    required
                    onChange={e => setPaymentType(e.target.value)}
                    sx={{m: 2, width: "25ch"}}
                >
                    {paymentTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Currency"
                    defaultValue="Lei"
                    required
                    onChange={e => setCurrency(e.target.value)}
                    helperText="Please select your currency"
                    sx={{m: 2, width: "25ch"}}
                >
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    variant='outlined'
                    type="text"
                    label="Description"
                    color='primary'
                    onChange={e => {
                        setDescription(e.target.value);
                        setDescriptionError(false);
                        setDescriptionText("MAX 250 characters");
                    }}
                    error={descriptionError}
                    helperText={descriptionText}
                    value={description}
                    fullWidth
                    required
                    sx={{m: 2, width: "50ch"}}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateField
                        label="Date"
                        variant='outlined'
                        color='primary'
                        value={date}
                        onChange={e => {
                            setDate(e);
                            setDateError(false);
                            setDateText("");
                        }}
                        minDate={dayjs('2000-01-01')}
                        maxDate={dayjs('2100-01-01')}
                        onError={() => setDateText("Date must be between 01-01-2000 and 01-01-2100.")}
                        helperText={dateText}
                        required
                        sx={{m: 2, width: "25ch"}}
                        />
                </LocalizationProvider>
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
                <AutoComplete
                    multiple
                    options={allCategories}
                    getOptionLabel={(option: Category) => option.name}
                    label="Categories"
                    error={false}
                    helperText=""
                    onInputChange={handleCategoryInputChange}
                    onChange={(e: any, value: any) => {
                        setCategories(value);
                    }}
                    filterOptions={(x: any) => x}
                    sx={{m: 2, width: "25ch"}}
                />
                <Button variant="outlined" color="primary" type="submit" sx={{m: 4, width: "25ch"}} onClick={handleSubmit}>Add</Button>
            </FormGroup>
        </Box>
    );
}
