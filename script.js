document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("studyForm");
    const tableBody = document.querySelector("#logTable tbody");
    const filterBtn = document.getElementById("filterBtn");
    const chartCanvas = document.getElementById("studyChart");
    const randomBtn = document.getElementById("randomSession");

    let studyLogs = [];
    let chart;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = {
            subject: document.getElementById("subject").value,
            date: document.getElementById("date").value,
            duration: Number(document.getElementById("duration").value),
            notes: document.getElementById("notes").value,
        };

        studyLogs.push(data);
        renderTable(studyLogs);
        updateChart(studyLogs);
        form.reset();
    });

    filterBtn.addEventListener("click", () => {
        const from = document.getElementById("fromDate").value;
        const to = document.getElementById("toDate").value;

        const results = studyLogs.filter((log) => {
            return (!from || log.date >= from) && (!to || log.date <= to);
        });

        renderTable(results);
        updateChart(results);
    });

    randomBtn.addEventListener("click", () => {
        const subjects = [
            "Math",
            "Physics",
            "Chemistry",
            "History",
            "English",
            "Biology",
        ];
        const today = new Date();
        const randomDaysAgo = Math.floor(Math.random() * 30);
        const date = new Date(today);
        date.setDate(today.getDate() - randomDaysAgo);

        studyLogs.push({
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            date: date.toISOString().split("T")[0],
            duration: Math.floor(Math.random() * 120) + 15,
            notes: "Auto-generated test session",
        });

        renderTable(studyLogs);
        updateChart(studyLogs);
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

    function updateChart(logs) {
        const totalsByDate = {};
        logs.forEach((log) => {
            totalsByDate[log.date] =
                (totalsByDate[log.date] || 0) + log.duration;
        });

        const labels = Object.keys(totalsByDate).sort();
        const data = labels.map((date) => totalsByDate[date]);

        if (chart) chart.destroy();

        chart = new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Minutes Studied",
                        data,
                        backgroundColor: "#4f46e5",
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });
    }
});
