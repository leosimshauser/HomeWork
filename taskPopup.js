function openTaskPopup(
    subject,
    existingTask = null,
    taskIndex = null
) {

    document.getElementById(
        "task-popup-overlay"
    )?.remove();

    const overlay =
        document.createElement("div");

    overlay.id =
        "task-popup-overlay";

    overlay.style.position =
        "fixed";

    overlay.style.inset = "0";

    overlay.style.background =
        "rgba(0,0,0,0.75)";

    overlay.style.zIndex =
        "999999";

    const popup =
        document.createElement("div");

    popup.style.position =
        "absolute";

    popup.style.top = "50%";

    popup.style.left = "50%";

    popup.style.transform =
        "translate(-50%,-50%)";

    popup.style.width =
        "700px";

    popup.style.background =
        "#1d1d1d";

    popup.style.color =
        "white";

    popup.style.padding =
        "25px";

    popup.innerHTML = `
        <h2>
            ${existingTask ?
                "Edit task" :
                "Create task"}
        </h2>

        <label>Task name</label>
        <input id="taskName"
            value="${existingTask?.taskName || ""}"
            style="width:100%">
        
        <br>

        <label>Hours required</label>
        <input id="hours"
            type="number"
            value="${existingTask?.hours || ""}"
            style="width:100%">
        <br>

        <label>Due date</label>
        <input id="dueDate"
            type="date"
            value="${existingTask?.dueDate || ""}"
            style="width:100%">
        <br>

        <label>Weighting</label>
        <input id="weighting"
            type="number"
            value="${existingTask?.weighting || 0}"
            style="width:100%">
        <br>

        <label>Completion</label>
        <input id="comp"
            type="number"
            value="${existingTask?.comp || 0}"
            style="width:100%">
        <br>

        <label>Difficulty</label>
        <input id="diff"
            type="number"
            value="${existingTask?.diff || 2.5}"
            style="width:100%">
        <br>
        <b id = "taskError"></b><br>
        <button id="saveTask">
            Save
        </button>

        <button id="cancelTask">
            Cancel
        </button>
    `;

    overlay.appendChild(
        popup
    );

    document.body.appendChild(
        overlay
    );

    document.getElementById(
        "cancelTask"
    ).addEventListener(
        "click",
        () => overlay.remove()
    );

    document.getElementById(
        "saveTask"
    ).addEventListener(
        "click",
        async () => {
            const taskName =
                document.getElementById("taskName").value;

            const hours =
                Number(
                    document.getElementById("hours").value
                );

            const dueDate =
                document.getElementById("dueDate").value;

            const weighting =
                Number(
                    document.getElementById("weighting").value
                );

            const comp =
                Number(
                    document.getElementById("comp").value
                );

            const diff =
                Number(
                    document.getElementById("diff").value
                );

            const error =
                validateTask(
                    taskName,
                    hours,
                    dueDate,
                    weighting,
                    comp,
                    diff
                );

            if (error !== "") {

                document.getElementById(
                    "taskError"
                ).textContent = error;

                return;
            }
            const {
                weights = window.DEFAULT_WEIGHTS
            } = await chrome.storage.local.get("weights");

            const task = new Task(
                taskName,
                hours,
                dueDate,
                weighting,
                comp,
                diff
            );

            task.calculateImportance(weights);
            task.calculateAveHours();

            const data =
                await chrome.storage.local.get(
                    "subjects"
                );

            const subjects =
                data.subjects;

            const storedSubject =
                subjects.find(
                    s =>
                        s.subjectName ===
                        subject.subjectName
                );

            if (
                taskIndex !== null
            ) {
                storedSubject.tasks[
                    taskIndex
                ] = task;
            }
            else {
                storedSubject.tasks.push(
                    task
                );
            }

            await chrome.storage.local.set({
                subjects
            });

            overlay.remove();

            document.dispatchEvent(
                new Event("tasksUpdated")
            );
        }
    );

}

function validateTask(
    taskName,
    hours,
    dueDate,
    weighting,
    comp,
    diff
) {
    
    if (taskName.trim() === "") {
        return "Task name cannot be empty.";
    }

    if (taskName.length >= 100) {
        return "Task name cannot be 100 characters or more"
    }
    
    if (hours <= 0 || isNaN(hours)) {
        return "Hours must be greater than 0.";
    }

    if (dueDate === "") {
        return "Please select a due date.";
    }

    if (new Date(dueDate) <= new Date()) {
        return "Due date cannot be the current day or in the past.";
    }

    if (weighting < 0 || weighting > 100) {
        return "Weighting must be between 0 and 100.";
    }

    if (comp < 0 || comp >= 100) {
        return "Completion must be between 0 and 100, excluding 100.";
    }

    if (diff < 0 || diff > 5) {
        return "Difficulty must be between 1 and 5.";
    }

    return "";
}