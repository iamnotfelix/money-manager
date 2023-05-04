export const FormComponent = (props: any) => {
    return (
        <form autoComplete="off" noValidate>
            {props.children}
        </form>
);
} 