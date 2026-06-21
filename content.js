(async function () {

    // Remove previous copy if button is clicked again
    document.getElementById("homework-container")?.remove();

    // Get stored subjects
    const { subjects = [] } =
        await chrome.storage.local.get("subjects");

    console.log("Subjects:", subjects);

    // Find where to insert the extension
    const content =
        document.getElementById("content");

    if (!content) {
        console.error("Could not find #content");
        return;
    }

    // Main container
    const container =
        document.createElement("div");

    container.id = "homework-container";

    // Reuse some existing SchoL classes if desired
    container.className =
        "scrollable show-for-medium-up";

    // Title
    const title =
        document.createElement("h2");

    title.textContent =
        "Homework Ordering System";

    container.appendChild(title);

    // Subject area
    const subjectArea =
        document.createElement("div");

    subjectArea.style.display = "flex";
    subjectArea.style.flexWrap = "wrap";
    subjectArea.style.gap = "10px";

    subjects.forEach(subject => {

        const card =
            document.createElement("div");

        // Reuse the timetable styling
        card.className =
            "timetable-subject";

        card.style.backgroundColor =
            subject.colour;

        card.style.height = "auto";
        card.style.minWidth = "200px";
        card.style.padding = "10px";

        card.innerHTML = `
            <strong>${subject.subjectName}</strong>
            <br>
            ${subject.teacher}
            <br><br>
            <button>Create Task</button>
        `;

        const button =
            card.querySelector("button");

        button.addEventListener("click", () => {
            console.log(
                "Create task for",
                subject.subjectName
            );

            openTaskPopup(subject);
        });
        
        subjectArea.appendChild(card);
    });

    container.appendChild(subjectArea);

    // Insert below the page content
    content.after(container);

})();

function openTaskPopup(subject) {

    document.getElementById("task-popup")?.remove();

    const popup =
        document.createElement("div");

    popup.id = "task-popup";

    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform =
        "translate(-50%, -50%)";

    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.border = "1px solid black";
    popup.style.zIndex = "99999";

    popup.innerHTML = `
        <h2>${subject.subjectName}</h2>

        <input id="taskName"
               placeholder="Task name">
        <br><br>

        <input id="hours"
               type="number"
               placeholder="Hours">
        <br><br>

        <input id="dueDate"
               type="date">
        <br><br>

        <button id="saveTask">
            Save
        </button>

        <button id="closeTask">
            Close
        </button>
    `;

    document.body.appendChild(popup);

    document
        .getElementById("closeTask")
        .addEventListener("click", () => {
            popup.remove();
        });
}