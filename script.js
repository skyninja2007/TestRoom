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
        const inSubject = document.getElementById("inSubject").value;

        const results = studyLogs.filter((log) => {
            return (
                (!from || log.date >= from) &&
                (!to || log.date <= to) &&
                (!inSubject || log.subject == inSubject)
            );
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
        const studyNotes = [
            "Focused on calculus for 2 hours—finally understand derivatives!",
            "Reviewed 3 chapters of biology, feeling productive.",
            "Did a quick 15-min Pomodoro for history notes.",
            "Memorized 50 new Spanish vocabulary words.",
            "Rewrote lecture notes to make them easier to understand.",
            "Accidentally spent 30 minutes reorganizing my pens instead of studying.",
            "Studied for 1 hour… then rewarded myself with a 2-hour snack break.",
            "Tried to focus… ended up watching 5 cat videos in a row.",
            "Started reading chemistry notes… ended up daydreaming about pizza.",
            "Mastered the art of highlighting without actually reading.",
            "Talked to my houseplant about history—it listens better than me sometimes.",
            "Realized I can write 'studied' in my tracker even if I only opened the book.",
            "Did math while standing on one leg for balance… and failed spectacularly.",
            "Counted how many pens I own instead of counting atoms in physics.",
            "Tried to make flashcards… but made a mini comic instead.",
            "Read notes aloud like a podcast host… neighbors might disagree.",
            "Organized my desk instead of organizing my thoughts.",
            "Spent 10 minutes looking for the motivation I lost last week.",
            "Drank 3 cups of coffee and still can’t remember the formula.",
            "Finished an entire chapter and rewarded myself with a nap.",
        ];

        const today = new Date();
        const randomDaysAgo = Math.floor(Math.random() * 30);
        const date = new Date(today);
        date.setDate(today.getDate() - randomDaysAgo);

        document.getElementById("subject").value =
            subjects[Math.floor(Math.random() * subjects.length)];
        document.getElementById("date").value = String(
            date.toISOString().split("T")[0],
        );
        document.getElementById("duration").value = String(
            Math.floor(Math.random() * 120) + 15,
        );
        document.getElementById("notes").value =
            studyNotes[Math.floor(Math.random() * studyNotes.length)];
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
        const dates = [...new Set(logs.map((log) => log.date))].sort();

        // Get unique subjects
        const subjects = [...new Set(logs.map((log) => log.subject))];

        // Build datasets per subject
        const datasets = subjects.map((subject, index) => {
            const data = dates.map((date) => {
                const total = logs
                    .filter(
                        (log) => log.subject === subject && log.date === date,
                    )
                    .reduce((sum, log) => sum + log.duration, 0);
                return total;
            });

            return {
                label: subject,
                data,
                borderWidth: 2,
                fill: false,
                tension: 0.3,
            };
        });

        if (chart) chart.destroy();

        chart = new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: dates,
                datasets,
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
