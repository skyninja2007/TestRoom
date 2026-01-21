document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("studyForm");
    const tableBody = document.querySelector("#logTable tbody");
    const filterBtn = document.getElementById("filterBtn");

    // Temporary in-memory storage (simulates backend)
    let studyLogs = [];

    // Submit study session
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            subject: document.getElementById("subject").value,
            date: document.getElementById("date").value,
            duration: Number(document.getElementById("duration").value),
            notes: document.getElementById("notes").value,
        };

        // FRONTEND → BACKEND EVENT (mocked)
        // await fetch("/log-study", { method: "POST", body: JSON.stringify(data) });

        studyLogs.push(data);
        renderTable(studyLogs);
        form.reset();
    });

    // Filter study logs
    filterBtn.addEventListener("click", async () => {
        const from = document.getElementById("fromDate").value;
        const to = document.getElementById("toDate").value;

        // FRONTEND → BACKEND EVENT (mocked)
        // const response = await fetch(`/study-logs?from=${from}&to=${to}`);
        // const results = await response.json();

        const results = studyLogs.filter((log) => {
            return (!from || log.date >= from) && (!to || log.date <= to);
        });

        renderTable(results);
    });

    function renderTable(logs) {
        tableBody.innerHTML = "";
        logs.forEach((log) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${log.date}</td>
        <td>${log.subject}</td>
        <td>${log.duration}</td>
        <td>${log.notes || ""}</td>
      `;
            tableBody.appendChild(row);
        });
    }
});
