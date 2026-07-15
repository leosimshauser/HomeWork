console.log("hourSect.js loaded");

async function buildHoursSection(tasks) {
    const sorted = [...tasks];

    function setAveHours(tasks) {
        let totAveHours = 0;
        for (let i = 0; i < tasks.length; i++) {
            totAveHours += tasks[i].task.aveHours;
        }
        return totAveHours;
    }
    const totAveHours = setAveHours(tasks)
    const section =
        document.createElement("div");
    section.id =
        "hours-section";
    section.innerHTML =`
        <h2>
            AVERAGE HOURS STUDYING PER DAY
        </h2>
        <div style="width: 150px; min-height: 60px; background: rgb(239, 118, 72); color: white; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: bold;">${totAveHours.toFixed(1)}</div>
        `
    return section;
}