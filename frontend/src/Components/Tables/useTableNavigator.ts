import { useState } from "react";

export const useTableNavigator = (initialValues: any) => {
    const [navigatorValues, setNavigatorValues] = useState(initialValues);

    const handlePageChange = (res: any) => {
        const previousPage = res.previousPage ? res.previousPage : "";
        const nextPage = res.nextPage ? res.nextPage : "";
        setNavigatorValues({
            ...navigatorValues,
            previous: previousPage,
            next: nextPage,
            previousDisabled: previousPage.length > 0 ? false : true,
            nextDisabled: nextPage.length > 0 ? false : true
        });
    }

    const handleClickPrevious = () => {
        const previous = navigatorValues["previous"];
        setNavigatorValues({
            ...navigatorValues,
            current: previous
        });
    }

	const handleClickNext = () => {
        const next = navigatorValues["next"];
        setNavigatorValues({
            ...navigatorValues,
            current: next
        });
	}

    const setCurrent = (current: any) => {
        setNavigatorValues({
            ...navigatorValues,
            current: current
        });
    }

    return {
        navigatorValues,
        handleClickNext,
        handleClickPrevious,
        handlePageChange,
        setCurrent
    };
}
