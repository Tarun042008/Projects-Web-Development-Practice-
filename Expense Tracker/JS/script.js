//1-GET HTML ELEMENTS 

// Form
const expenseForm = document.getElementById("expense-form");

// Input fields
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

// Expense list
const expenseList = document.getElementById("expense-list");

// Summary elements
const totalSpending = document.getElementById("total-spending");
const monthlySpending = document.getElementById("monthly-spending");
const expenseCount = document.getElementById("expense-count");

// Filters
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const sortSelect = document.getElementById("sort");

// ==========================================
// 2. DATA
// ==========================================

// This array will contain all our expenses.
let expenses = [];

// ==========================================
// 3. ADD EXPENSE
// ==========================================

expenseForm.addEventListener("submit", function (event) {

    // Prevent the browser from refreshing the page
    event.preventDefault();
    /*
    My notes-So when submit  the form usual the form gets submitted and the page refreshes but we dont want that happening here!
    */
    // Create an expense object
    const expense = {

        description: descriptionInput.value,

        amount: Number(amountInput.value),

        category: categoryInput.value,

        date: dateInput.value
    };


    // Add the expense object to our array
    expenses.push(expense);


    // Clear the form
    expenseForm.reset();//resets the form inputs back to their default values


    // Update the UI
    renderExpenses();

});


// ==========================================
// 4. RENDER EXPENSES-()
// ==========================================

function renderExpenses() {

    // Clear the existing list
    expenseList.innerHTML = "";

    // Get the expenses that should currently be displayed
    let filteredExpenses = getFilteredExpenses();

    // If there are no expenses
    if (filteredExpenses.length === 0) {

        expenseList.innerHTML = `
            <p class="empty-message">
                No expenses found.
            </p>
        `;

        updateSummary();

        return;
    }

    // Create HTML for every expense
    filteredExpenses.forEach(function (expense, index) {

        const expenseElement = document.createElement("div");

        expenseElement.classList.add("expense-item");


        expenseElement.innerHTML = `

            <div class="expense-info">

                <p class="expense-description">
                    ${expense.description}
                </p>

                <p class="expense-meta">
                    ${expense.category} • ${expense.date}
                </p>

            </div>


            <div>

                <span class="expense-amount">
                    ₹${expense.amount}
                </span>

                <button
                    class="delete-btn"
                    data-index="${index}"
                >
                    Delete
                </button>

            </div>
        `;


        // Add the expense to the page
        expenseList.appendChild(expenseElement);

    });


    // Update summary information
    updateSummary();
}