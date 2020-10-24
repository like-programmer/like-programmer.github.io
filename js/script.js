(function () {
    const constructorElement = document.querySelector(".constructor__table-container");
    const constructorDropdownCurrentElement = constructorElement.querySelector(".dropdown__current");
    const constructorDropdownListItemElements = Array.from(constructorElement.querySelectorAll(".dropdown__list-item"));

    const toggleClass = (element, className) => {
        return element.classList.contains(`${className}`) ?
            element.classList.remove(`${className}`) :
            element.classList.add(`${className}`);
    };

    constructorDropdownCurrentElement.addEventListener("click", (evt) => toggleClass(evt.target.parentElement, `dropdown--opened`));


    constructorDropdownListItemElements.forEach((listItem) => {
        listItem.addEventListener("click", (evt) => {
            toggleClass(evt.target.parentElement.parentElement, `dropdown--opened`);
            constructorDropdownCurrentElement.textContent = evt.target.textContent;
        });
    });

    /*----------------------------------------------------------------------------*/
    const mobileMenuBtnElement = document.querySelector(".burger-btn");
    const mainNavElement = document.querySelector(".main-nav");

    mobileMenuBtnElement.addEventListener("click", () => {
        toggleClass(mobileMenuBtnElement, `burger-btn--opened`);
        toggleClass(mainNavElement, `main-nav--opened`);
    });

    /*----------------------------------------------------------------------------*/
    const mobileCartBtnElement = document.querySelector(".seed");
    const desktopCartBtnElement = document.querySelector(".dropdown-btn.page-header__dropdown-btn");
    const cartPopupElement = document.querySelector(".order-details");
    const closePopupBtnElement = document.querySelector(".close-btn.order-details__close-btn");

    const mobileCartBtnClickHandler = () => {
        toggleClass(cartPopupElement, `order-details--opened`);
    };
    const desktopCartBtnClickHandler = () => {
        toggleClass(desktopCartBtnElement, `dropdown-btn--opened`);
        toggleClass(cartPopupElement, `order-details--opened`);
    };

    const openPopup = () => {
        const isMobileScreen = document.documentElement.clientWidth >= 320 && document.documentElement.clientWidth < 768;

        isMobileScreen && mobileCartBtnElement.addEventListener("click", mobileCartBtnClickHandler);
        desktopCartBtnElement.addEventListener("click", desktopCartBtnClickHandler);
    };

    const closePopup = () => {
        cartPopupElement.classList.remove(`order-details--opened`);
    };

    window.addEventListener("load", () => {
        openPopup();

        window.addEventListener("resize", () => {
            mobileCartBtnElement.removeEventListener("click", mobileCartBtnClickHandler, false);
            desktopCartBtnElement.removeEventListener("click", desktopCartBtnClickHandler, false);
            openPopup();
        });
    });

    closePopupBtnElement.addEventListener("click", closePopup);

    /*----------------------------------------------------------------------------*/
    const setStartConstructorValues = () => {
        constructorValues[0].maxLimit = 100;

        constructorValues[1].value = 20;
        constructorValues[1].maxLimit = constructorValues[0].value < 100 ? 100 - constructorValues[0].value : 0;

        constructorValues[2].value = 30;
        constructorValues[2].maxLimit = (constructorValues[0].value + constructorValues[1].value) < 100 ? 100 - (constructorValues[0].value + constructorValues[1].value) : 0;

        constructorValues[3].maxLimit = (constructorValues[0].value + constructorValues[1].value + constructorValues[2].value) < 100 ? 100 - (constructorValues[0].value + constructorValues[1].value + constructorValues[2].value) : 0;
        constructorValues[3].value = constructorValues[3].maxLimit;
    };

    const constructorValues = [
        {
            value: 0,
            maxLimit: 0,
        },
        {
            value: 0,
            maxLimit: 0,
        },
        {
            value: 0,
            maxLimit: 0,
        },
        {
            value: 0,
            maxLimit: 0,
        },
    ];

    setStartConstructorValues();

    /*-------------------------------------------------------------------------------------------*/
    const constructorRowElement = Array.from(document.querySelectorAll(".constructor__row-container")).slice(0, -1);
    const progressBarElementWidth = constructorRowElement[0].querySelector(".progress-bar").offsetWidth;

    const convertNumberToPercent = (number) => {
        return parseInt((number / progressBarElementWidth * 100), 10);
    };

    const convertPercentToNumber = (percent) => {
        return parseInt((progressBarElementWidth / 100 * percent), 10);
    };

    const updateConstructorValueProperties = (updatedObjectIndex) => {
        constructorValues.map((element, elementIndex) => {
            if (elementIndex > updatedObjectIndex) {
                if (elementIndex === 1) {
                    constructorValues[elementIndex].maxLimit = constructorValues[0].value < 100 ? 100 - constructorValues[0].value : 0;
                    constructorValues[elementIndex].value = constructorValues[elementIndex].value <= constructorValues[elementIndex].maxLimit ? constructorValues[elementIndex].value : constructorValues[elementIndex].maxLimit;
                }

                if (elementIndex === 2) {
                    constructorValues[elementIndex].maxLimit = (constructorValues[0].value + constructorValues[1].value) < 100 && constructorValues[1].maxLimit > 0 ? 100 - (constructorValues[0].value + constructorValues[1].value) : 0;
                    constructorValues[elementIndex].value = constructorValues[elementIndex].value <= constructorValues[elementIndex].maxLimit ? constructorValues[elementIndex].value : constructorValues[elementIndex].maxLimit;
                }

                if (elementIndex === 3) {
                    constructorValues[elementIndex].maxLimit = (constructorValues[0].value + constructorValues[1].value + constructorValues[2].value) < 100 && constructorValues[2].maxLimit > 0 ? 100 - (constructorValues[0].value + constructorValues[1].value + constructorValues[2].value) : 0;
                    constructorValues[elementIndex].value = constructorValues[elementIndex].maxLimit;
                }
            }
        });
    };

    const returnControlOffset = (valueInPercents) => {
        if (valueInPercents === 0) {
            return 0;
        }

        if (valueInPercents === 100) {
            return `${progressBarElementWidth}px`;
        }

        return `${convertPercentToNumber(valueInPercents)}px`;
    };

    const setNewControlsValues = () => {
        constructorRowElement.forEach((element, controlIndex) => {
            const controlElement = element.querySelector(".progress-bar__control");
            const progressBarValueElement = element.querySelector(".constructor__row-value");
            progressBarValueElement.textContent = `${constructorValues[controlIndex].value}%`;
            controlElement.style.left = returnControlOffset(constructorValues[controlIndex].value);
        });
    };

    const setControlsPosition = () => {
        constructorRowElement.forEach((element, controlIndex) => {
            const controlElement = element.querySelector(".progress-bar__control");
            const progressBarValueElement = element.querySelector(".constructor__row-value");

            progressBarValueElement.textContent = `${constructorValues[controlIndex].value}%`;
            controlElement.style.left = returnControlOffset(constructorValues[controlIndex].value);

            if (controlIndex < 3) {
                controlElement.addEventListener("mousedown", (evt) => {
                    evt.preventDefault();

                    let startCoords = {
                        x: evt.clientX
                    };

                    const limits = {
                        min: 0,
                        max: convertPercentToNumber(constructorValues[controlIndex].maxLimit),
                    };


                    const controlMouseMoveHandler = (moveEvt) => {
                        moveEvt.preventDefault();

                        const shift = {
                            x: startCoords.x - moveEvt.clientX
                        };

                        startCoords = {
                            x: moveEvt.clientX
                        };

                        if ((controlElement.offsetLeft - shift.x) < limits.min) {
                            controlElement.style.left = `${limits.min}px`;
                        }

                        if ((controlElement.offsetLeft - shift.x) > limits.max) {
                            controlElement.style.left = `${limits.max}px`;
                        }

                        controlElement.style.left = `${(controlElement.offsetLeft - shift.x)}px`;
                        progressBarValueElement.textContent = `${constructorValues[controlIndex].value}%`;

                        constructorValues[controlIndex].value = convertNumberToPercent((controlElement.offsetLeft - shift.x));
                        updateConstructorValueProperties(controlIndex);
                    };

                    const controlMouseUpHandler = (upEvt) => {
                        upEvt.preventDefault();

                        setNewControlsValues();

                        document.removeEventListener("mousemove", controlMouseMoveHandler);
                        document.removeEventListener("mouseup", controlMouseUpHandler);
                    };

                    document.addEventListener("mousemove", controlMouseMoveHandler);
                    document.addEventListener("mouseup", controlMouseUpHandler);
                });

                controlElement.addEventListener("touchstart", (evt) => {

                    let startCoords = {
                        x: evt.touches[0].clientX
                    };

                    const limits = {
                        min: 0,
                        max: convertPercentToNumber(constructorValues[controlIndex].maxLimit),
                    };


                    const controlMouseMoveHandler = (moveEvt) => {

                        const shift = {
                            x: startCoords.x - moveEvt.touches[0].clientX
                        };

                        startCoords = {
                            x: moveEvt.touches[0].clientX
                        };

                        if ((controlElement.offsetLeft - shift.x) < limits.min) {
                            controlElement.style.left = `${limits.min}px`;
                        }

                        if ((controlElement.offsetLeft - shift.x) > limits.max) {
                            controlElement.style.left = `${limits.max}px`;
                        }

                        controlElement.style.left = `${(controlElement.offsetLeft - shift.x)}px`;
                        progressBarValueElement.textContent = `${constructorValues[controlIndex].value}%`;

                        constructorValues[controlIndex].value = convertNumberToPercent((controlElement.offsetLeft - shift.x));
                        updateConstructorValueProperties(controlIndex);
                    };

                    const controlMouseUpHandler = () => {

                        setNewControlsValues();

                        document.removeEventListener("touchmove", controlMouseMoveHandler);
                        document.removeEventListener("touchend", controlMouseUpHandler);
                    };

                    document.addEventListener("touchmove", controlMouseMoveHandler);
                    document.addEventListener("touchend", controlMouseUpHandler);
                });
            }
        });
    };

    setControlsPosition();
})();
