// =========================
// THEME SAFE GUARD
// =========================
document.documentElement.setAttribute(
    "data-theme",
    localStorage.getItem("theme") || "light"
  );
  
  // =========================
  // ELEMENTS
  // =========================
  const allowanceInput = document.getElementById("allowance");
  const monthlyBalanceEl = document.getElementById("monthlyBalance");
  const yearlySavingsEl = document.getElementById("yearlySavings");
  const stateSelect = document.getElementById("state");
  const customStateInput = document.getElementById("customState");
  const removeStateBtn = document.getElementById("removeState");
  
  const expenseList = document.getElementById("expenseList");
  const addExpenseBtn = document.getElementById("addExpense");
  const resetBtn = document.getElementById("resetBtn");
  
  // =========================
  // STATES (BASE LIST)
  // =========================
  const states = [
    "Abuja (FCT)", "Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti",
    "Kwara", "Kogi", "Niger", "Kaduna", "Kano", "Katsina",
    "Enugu", "Anambra", "Imo", "Abia", "Ebonyi",
    "Rivers", "Bayelsa", "Delta", "Edo",
    "Akwa Ibom", "Cross River",
    "Benue", "Plateau", "Nasarawa",
    "Adamawa", "Borno", "Yobe",
    "Taraba", "Gombe", "Bauchi", "Jigawa", "Zamfara", "Sokoto", "Kebbi"
  ];
  
  // Populate state dropdown
  states.forEach(state => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });
  
  // =========================
  // CUSTOM STATE (ADD)
  // =========================
  customStateInput.addEventListener("change", () => {
    const value = customStateInput.value.trim();
    if (!value) return;
  
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    option.selected = true;
    stateSelect.appendChild(option);
  
    customStateInput.value = "";
  });
  
  // =========================
  // STATE (REMOVE)
  // =========================
  removeStateBtn.addEventListener("click", () => {
    const index = stateSelect.selectedIndex;
    if (index <= 0) return;
    stateSelect.remove(index);
    stateSelect.selectedIndex = 0;
  });
  
  // =========================
  // EXPENSES (DYNAMIC)
  // =========================
  function addExpenseField(name = "", value = "") {
    const row = document.createElement("div");
    row.className = "expense-row";
  
    row.innerHTML = `
      <input type="text" placeholder="Expense name" value="${name}">
      <input type="number" placeholder="Amount" value="${value}">
      <button type="button" aria-label="Remove expense">✕</button>
    `;
  
    row.querySelector("button").onclick = () => {
      row.remove();
      calculate();
    };
  
    row.querySelectorAll("input").forEach(i =>
      i.addEventListener("input", calculate)
    );
  
    expenseList.appendChild(row);
  }
  
  // Default expenses
  ["Food", "Transport", "Rent"].forEach(e => addExpenseField(e));
  
  // =========================
  // CALCULATION
  // =========================
  function calculate() {
    const allowance = Number(allowanceInput.value) || 0;
  
    let expenses = 0;
    document
      .querySelectorAll(".expense-row input[type='number']")
      .forEach(i => expenses += Number(i.value) || 0);
  
    const monthlyBalance = allowance - expenses;
    const yearlySavings = monthlyBalance * 12;
  
    monthlyBalanceEl.textContent = `₦${monthlyBalance.toLocaleString()}`;
    monthlyBalanceEl.className = monthlyBalance >= 0 ? "positive" : "negative";

    yearlySavingsEl.textContent = `₦${yearlySavings.toLocaleString()}`;

  }
  
  // =========================
  // EVENTS
  // =========================
  allowanceInput.addEventListener("input", calculate);
  addExpenseBtn.addEventListener("click", () => addExpenseField());
  
  resetBtn.addEventListener("click", () => {
    expenseList.innerHTML = "";
    ["Food", "Transport", "Rent"].forEach(e => addExpenseField(e));
    monthlyBalanceEl.textContent = "₦0";
    yearlySavingsEl.textContent = "₦0";
  });
  
  // =========================
  // COPY & PRINT (FINAL)
  // =========================
  document.addEventListener("DOMContentLoaded", () => {
    const copyBtn = document.getElementById("copyResults");
    const printBtn = document.getElementById("printResults");
  
    // ---------- COPY ----------
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const lines = [];
  
        lines.push("NaijaNYSCBudgeter — NYSC Budget Summary");
        lines.push("");
        lines.push(`State of Service:  ${stateSelect.value || "Not selected"}`);
        lines.push(`Monthly Allowance: ₦${Number(allowanceInput.value || 0).toLocaleString()}`);
        lines.push("");
        lines.push("Expenses:");
  
        document.querySelectorAll(".expense-row").forEach(row => {
          const name = (row.querySelector("input[type='text']").value || "Expense").trim();
          const amount = Number(row.querySelector("input[type='number']").value || 0);
          lines.push(`${name.padEnd(14, " ")} ₦${amount.toLocaleString()}`);
        });
  
        lines.push("");
        lines.push(`Monthly Balance:   ${monthlyBalanceEl.textContent}`);
        lines.push(`Yearly Savings:    ${yearlySavingsEl.textContent}`);
  
        navigator.clipboard.writeText(lines.join("\n"));
        alert("Budget copied to clipboard");
      });
    }
  
    // ---------- PRINT ----------
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        const rows = [];
  
        document.querySelectorAll(".expense-row").forEach(row => {
          const name = row.querySelector("input[type='text']").value || "Expense";
          const amount = Number(row.querySelector("input[type='number']").value || 0);
          rows.push(`<tr><td>${name}</td><td>₦${amount.toLocaleString()}</td></tr>`);
        });
  
        const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>NYSC Budget Summary</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 24px;
        color: #000;
      }
      h1 {
        font-size: 18px;
        margin-bottom: 16px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0;
      }
      td {
        padding: 6px 4px;
      }
      td:last-child {
        text-align: right;
      }
      .total {
        font-weight: bold;
        margin-top: 16px;
      }
    </style>
  </head>
  <body>
    <h1>NaijaNYSCBudgeter — NYSC Budget Summary</h1>
  
    <p><strong>State of Service:</strong> ${stateSelect.value || "Not selected"}</p>
    <p><strong>Monthly Allowance:</strong> ₦${Number(allowanceInput.value || 0).toLocaleString()}</p>
  
    <table>
      ${rows.join("")}
    </table>
  
    <p class="total">Monthly Balance: ${monthlyBalanceEl.textContent}</p>
    <p class="total">Estimated Yearly Savings: ${yearlySavingsEl.textContent}</p>
  </body>
  </html>
        `;
  
        const win = window.open("", "", "width=700,height=800");
        win.document.write(html);
        win.document.close();
        win.print();
      });
    }
  });
  
  document.querySelectorAll("input[type='number']").forEach(i => {
    i.addEventListener("input", () => {
      if (i.value < 0) i.value = 0;
    });
  });
  