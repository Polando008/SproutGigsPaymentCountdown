function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

function addCountdownRow(transactionRow) {
  const descriptionCell = transactionRow.querySelector("td:nth-child(3)");
  const dateCell = transactionRow.querySelector("td:nth-child(2)");
  const isPending = descriptionCell && dateCell && descriptionCell.textContent.includes("payment will be credited to your account in 14 days");
  const hasCountdown = transactionRow.nextElementSibling && transactionRow.nextElementSibling.classList.contains('countdown-row');

  if (!isPending || hasCountdown) {
    return;
  }

  const transactionDate = new Date(dateCell.textContent.trim() + ' UTC');
  const clearanceDate = new Date(transactionDate.getTime());
  clearanceDate.setDate(transactionDate.getDate() + 14);

  const countdownRow = document.createElement("tr");
  countdownRow.className = "countdown-row";

  const countdownCell = document.createElement('td');
  countdownCell.colSpan = transactionRow.cells.length;
  countdownCell.style.textAlign = 'center';
  countdownCell.style.padding = '8px 0';
  countdownCell.style.borderBottom = '1px solid #dee2e6';

  countdownRow.appendChild(countdownCell);

  transactionRow.parentNode.insertBefore(countdownRow, transactionRow.nextSibling);

  const timerInterval = setInterval(() => {
    const t = getTimeRemaining(clearanceDate);
    
    if (t.total <= 0) {
      countdownCell.textContent = "Payment should be cleared!";
      countdownCell.style.color = "#28a745";
      clearInterval(timerInterval);
    } else {
      countdownCell.innerHTML = `Payment will clear in: <span class="countdown-cell">${t.days}d ${t.hours}h ${t.minutes}m ${t.seconds}s</span>`;
    }
  }, 1000);
}

function initializeCountdown() {
  const transactionRows = document.querySelectorAll("tr.table-row.clickable");
  transactionRows.forEach(row => {
    addCountdownRow(row);
  });
}

const observer = new MutationObserver((mutations, obs) => {
  const table = document.querySelector(".table");
  if (table) {
    initializeCountdown();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
