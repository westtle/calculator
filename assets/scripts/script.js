let toEvaluate = "";
let isHistoryOpen = false;

const keys = "0123456789()/x-+.".split("");

// HTML.
const previousCalculation = document.querySelector("._previous-calculation"); // It's the text on top. The one in italic.
const result = document.querySelector("._calculation");

const buttons = document.querySelectorAll(".__buttons span");

const historyButton = document.querySelector("._history-icon");
const historyContainer = document.querySelector("._history-items");

function calculate() {
    let clickedText = this.innerText;

    // Convert so it can be evaluated correctly.
    if (clickedText == "x") clickedText = "*";

    // All clear.
    if (clickedText == "AC") {
        toEvaluate = "";
        result.innerText = "";
        maxLength();
        return;
    };

    // Delete.
    if (this.dataset.button == "delete") {
        if (result.innerText == "" || result.innerText == "Error" || result.innerText == "Infinity" || result.innerText == "undefined") {
            toEvaluate = "";
            result.innerText = "";
        };

        toEvaluate = toEvaluate.slice(0, -1);
        result.innerText = result.innerText.slice(0, -1);

        maxLength();
        return;
    };

    // Calculate.
    if (clickedText == "=") {
        try {
            if (result.innerText == "") return;

            previousCalculation.innerText = `${result.innerText}`;

            // Add to history.
            if (document.querySelector(".empty_") !== null) document.querySelector(".empty_").remove();
            historyContainer.innerHTML += `<span>${result.innerText}=${eval(toEvaluate)}</span>`;

            toEvaluate = `${eval(toEvaluate)}`; // Backtick so it's a string (got an error if it's not a string).
            result.innerText = toEvaluate;

        } catch {
            result.innerText = "Error";
        };

        maxLength();
        return;
    };

    // Result innerText.
    if (result.innerText == "Error" || result.innerText == "Infinity" || result.innerText == "undefined") {
        toEvaluate = "";
        toEvaluate += clickedText;

        result.innerText = "";
        result.innerText += clickedText;
    } else {
        result.innerText += clickedText;
        toEvaluate += clickedText;
    };

    maxLength();
};

function maxLength() {
    if (result.innerText.length >= 20) {
        buttons.forEach(button => {
            if (button.innerText == "AC" || button.dataset.button == "delete" || button.innerText == "=") {
                button.addEventListener("click", calculate);
            } else {
                button.removeEventListener("click", calculate);
            };
        });
    } else {
        buttons.forEach(button => button.addEventListener("click", calculate));
    };
};

function history() {
    if (!isHistoryOpen) {
        if (historyContainer.innerText == "") historyContainer.innerHTML = `<span class="empty_">Empty.</span>`;

        historyContainer.style.display = "block";

        historyButton.dataset.historyOpened = "true";
        isHistoryOpen = true;
    } else {
        historyContainer.style.display = "none";

        historyButton.dataset.historyOpened = "false";
        isHistoryOpen = false;
    };
};

buttons.forEach(button => button.addEventListener("click", calculate));
historyButton.addEventListener("click", history);
document.addEventListener("keydown", (e) => {
    keys.forEach((key, index) => {
        if (e.key == key.toLowerCase()) {
            buttons.forEach(button => {
                if (button.innerText.includes(e.key)) button.click();
            });
        };
    });

    switch (e.key) {
        case "End":
            buttons[0].click();
            break;

        case "Backspace":
        case "Delete":
            buttons[1].click();
            break;

        case "*":
            buttons[11].click();
            break;

        case "=":
        case "Enter":
            buttons[18].click();
            break;
    };
});