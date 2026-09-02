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


