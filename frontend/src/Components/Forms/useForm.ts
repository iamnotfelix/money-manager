import { useState } from "react"

export const useForm = (initialValues: any, initialErrorValues: any) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState(initialErrorValues);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    }

    const handleInputChange = (e: any) => {
        const { name } = e.target;
        setErrors({
            ...errors,
            [name + "Error"]: false,
            [name + "Text"]: ""
        });
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleChange,
        handleInputChange
    };
}