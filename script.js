const form = document.getElementById("transactionForm");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

const search = document.getElementById("search");
const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");
const sort = document.getElementById("sort");

const transactionList = document.getElementById("transactionList");
const clearAllBtn = document.getElementById("clearAll");

let transactions =
  JSON.parse(localStorage.getItem("transactions")) || [];

form.addEventListener("submit", addTransaction);
search.addEventListener("input", renderTransactions);
filterType.addEventListener("change", renderTransactions);
filterCategory.addEventListener("change", renderTransactions);
sort.addEventListener("change", renderTransactions);

clearAllBtn.addEventListener("click", () => {
  transactions = [];
  saveTransactions();
  renderTransactions();
});

function addTransaction(e) {
  e.preventDefault();

  const desc = description.value.trim();
  const amt = Number(amount.value);

  if (desc === "" || amt <= 0) {
    alert("Please enter valid details");
    return;
  }

  const transaction = {
    id: Date.now(),
    description: desc,
    amount: amt,
    type: type.value,
    category: category.value,
    date: new Date().toISOString()
  };

  transactions.push(transaction);

  saveTransactions();
  renderTransactions();

  form.reset();
}

function deleteTransaction(id) {
  transactions = transactions.filter(
    (transaction) => transaction.id !== id
  );

  saveTransactions();
  renderTransactions();
}

function saveTransactions() {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}

function updateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  const balance = income - expense;

  balanceEl.textContent = `₹${balance}`;
  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${expense}`;
}

function renderTransactions() {
  let filtered = [...transactions];

  const searchText = search.value.toLowerCase();

  filtered = filtered.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchText)
  );

  if (filterType.value !== "all") {
    filtered = filtered.filter(
      (transaction) => transaction.type === filterType.value
    );
  }

  if (filterCategory.value !== "all") {
    filtered = filtered.filter(
      (transaction) =>
        transaction.category === filterCategory.value
    );
  }

  if (sort.value === "highest") {
    filtered.sort((a, b) => b.amount - a.amount);
  } else if (sort.value === "lowest") {
    filtered.sort((a, b) => a.amount - b.amount);
  } else {
    filtered.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }

  transactionList.innerHTML = "";

  if (filtered.length === 0) {
    const div = document.createElement("div");
    div.className = "empty";
    div.textContent = "No transactions found";
    transactionList.appendChild(div);
  } else {
    filtered.forEach((transaction) => {
      const div = document.createElement("div");

      div.className = "transaction";

      div.innerHTML = `
        <div class="transaction-info">
          <span class="transaction-description">
            ${transaction.description}
          </span>

          <span class="transaction-category">
            ${transaction.category}
          </span>
        </div>

        <div class="transaction-right">
          <span class="transaction-amount ${transaction.type}">
            ${
              transaction.type === "income" ? "+" : "-"
            }₹${transaction.amount}
          </span>

          <button
            class="delete-btn"
            onclick="deleteTransaction(${transaction.id})"
          >
            Delete
          </button>
        </div>
      `;

      transactionList.appendChild(div);
    });
  }

  updateSummary();
}

renderTransactions();

window.deleteTransaction = deleteTransaction;