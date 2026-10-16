// ==============================
// TO-DOEY
// ==============================


// Create todos array
const toDos = [
    { text: "Record today's income", completed: false },
    { text: "Order dinner", completed: true },
    { text: "Sleep on time", completed: false },
];


// ==============================
// SELECT HTML ELEMENTS
// ==============================

const toDoForm = document.querySelector("#toDoForm");
const todoList = document.querySelector("#todoList");
const toDoInput = document.querySelector("#toDoInput");
const toDoError = document.querySelector("#toDoError");

const itemsLeft = document.querySelector("#itemsLeft");

const allTasks = document.querySelector("#allTasks");
const active = document.querySelector("#active");
const completed = document.querySelector("#completed");

const listStatus = document.querySelector("#listStatus");

const organizationLevel = document.querySelector("#organizationLevel");
const organizationProgress = document.querySelector("#organizationProgress");


// Keep track of selected filter
let currentFilter = "all";


// ==============================
// RENDER TODOS
// ==============================

function renderTodos() {

    // Clear old list
    todoList.innerHTML = "";

    // Clear status message
    listStatus.textContent = "";


    // ------------------------------
    // FILTER TASKS
    // ------------------------------

    let todosToShow = toDos;

    if (currentFilter === "active") {
        todosToShow = toDos.filter(
            (todo) => todo.completed === false
        );
    }

    if (currentFilter === "completed") {
        todosToShow = toDos.filter(
            (todo) => todo.completed === true
        );
    }


    // ------------------------------
    // EMPTY STATE
    // ------------------------------

    if (todosToShow.length === 0) {

        if (currentFilter === "active") {
            listStatus.textContent = "You have no active tasks!";
        }

        else if (currentFilter === "completed") {
            listStatus.textContent = "No completed tasks yet.";
        }

        else {
            listStatus.textContent = "Your to-do list is empty. Add a task!";
        }
    }


    // ------------------------------
    // CREATE TODO ITEMS
    // ------------------------------

    todosToShow.forEach((todo) => {

        const toDoElement = document.createElement("li");


        // Create separate text element
        const taskText = document.createElement("span");

        taskText.textContent = todo.text;
        taskText.classList.add("task-text");


        // Apply completed class
        toDoElement.classList.toggle(
            "completed",
            todo.completed
        );


        // ------------------------------
        // TOGGLE COMPLETE
        // ------------------------------

        taskText.addEventListener("click", function () {

            todo.completed = !todo.completed;

            renderTodos();
        });


        // ------------------------------
        // DELETE BUTTON
        // ------------------------------

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "×";
        deleteButton.classList.add("delete-btn");

        deleteButton.setAttribute(
            "aria-label",
            `Delete ${todo.text}`
        );


        deleteButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                // Find task's real position
                // in original array
                const originalIndex = toDos.indexOf(todo);

                if (originalIndex !== -1) {
                    toDos.splice(originalIndex, 1);
                }

                renderTodos();
            }
        );


        // Add text and button to li
        toDoElement.append(
            taskText,
            deleteButton
        );


        // Add li to ul
        todoList.append(toDoElement);
    });


    // ==============================
    // SUMMARY USING REDUCE
    // ==============================

    const taskSummary = toDos.reduce(
        function (summary, todo) {

            summary.total++;

            if (todo.completed === true) {
                summary.completed++;
            }

            else {
                summary.active++;
            }

            return summary;

        },
        {
            total: 0,
            active: 0,
            completed: 0
        }
    );


    // ==============================
    // FILTER BUTTON COUNTS
    // ==============================

    allTasks.textContent =
        `All (${taskSummary.total})`;

    active.textContent =
        `Active (${taskSummary.active})`;

    completed.textContent =
        `Completed (${taskSummary.completed})`;


    // ==============================
    // ITEMS LEFT
    // ==============================

    itemsLeft.textContent =
        `${taskSummary.active} items left`;


    // ==============================
    // EXPERIMENTAL FEATURE:
    // ORGANIZATION LEVEL
    // ==============================

    let organizationScore = 0;

    if (taskSummary.total > 0) {

        organizationScore = Math.round(
            (taskSummary.completed / taskSummary.total) * 10
        );
    }


    organizationLevel.textContent =
        `${organizationScore}/10`;


    organizationProgress.style.width =
        `${organizationScore * 10}%`;


    // ==============================
    // ACTIVE FILTER STYLING
    // ==============================

    allTasks.classList.toggle(
        "active-filter",
        currentFilter === "all"
    );

    active.classList.toggle(
        "active-filter",
        currentFilter === "active"
    );

    completed.classList.toggle(
        "active-filter",
        currentFilter === "completed"
    );
}


// ==============================
// FILTER BUTTONS
// ==============================


// ALL
allTasks.addEventListener(
    "click",
    function () {

        currentFilter = "all";

        renderTodos();
    }
);


// ACTIVE
active.addEventListener(
    "click",
    function () {

        currentFilter = "active";

        renderTodos();
    }
);


// COMPLETED
completed.addEventListener(
    "click",
    function () {

        currentFilter = "completed";

        renderTodos();
    }
);


// ==============================
// ADD NEW TODO
// ==============================

toDoForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const inputValue = toDoInput.value.trim();


        // ------------------------------
        // ERROR STATE
        // ------------------------------

        if (inputValue === "") {

            toDoError.textContent =
                "Please enter a task";

            return;
        }


        // Clear previous error
        toDoError.textContent = "";


        // Create new todo
        const newToDo = {

            text: inputValue,

            completed: false
        };


        // Add to array
        toDos.push(newToDo);


        // Return user to All view
        currentFilter = "all";


        // Render updated list
        renderTodos();


        // Clear input
        toDoForm.reset();
    }
);


// ==============================
// LOADING STATE
// ==============================

listStatus.textContent = "Loading tasks...";


// Simulated loading state
setTimeout(function () {

    renderTodos();

}, 500);