async function buildHomeworkUI() {

    document.getElementById(
        "homework-container"
    )?.remove();

    const { subjects = [] } =
        await chrome.storage.local.get(
            "subjects"
        );
    subjects.forEach(subject => {

        (subject.tasks || []).forEach(task => {
            const taskHours =
                Number(task.hours);

            const taskWeight =
                1 + Number(task.weighting) / 5;

            const taskComp =
                1 - Number(task.comp) / 100;

            const due =
                new Date(task.dueDate);

            const today =
                new Date();

            const days =
                Math.max(
                    1,
                    (due - today) /
                    (1000 * 60 * 60 * 24)
                );

            let taskDiff = 2.5;

            if (
                task.diff === "" ||
                task.diff === null ||
                isNaN(task.diff)
            ) {
                taskDiff = 2.5;
            }
            else {
                taskDiff =
                    Number(task.diff) / 5 + 0.5;
            }

            task.importance =
                (
                    taskHours /
                    days
                ) *
                taskWeight *
                taskComp *
                taskDiff;
            });
    });
    await chrome.storage.local.set({
        subjects
    }); 
    const tasks = [];

    subjects.forEach(subject => {

        (subject.tasks || []).forEach(task => {

            tasks.push({
                subject: subject.subjectName,
                task: task
            });

        });
    });

    function bubbleSort(tasks) {

        for (let i = 0; i < tasks.length - 1; i++) {

            for (let j = 0; j < tasks.length - i - 1; j++) {

                if (
                    tasks[j].task.importance <
                    tasks[j + 1].task.importance
                ) {

                    const temp = tasks[j];

                    tasks[j] = tasks[j + 1];

                    tasks[j + 1] = temp;
                }
            }
        }

        return tasks;
    }

    const sortedTasks =
        bubbleSort([...tasks]);

    sortedTasks.forEach((item, index) => {

        item.task.priority =
            index + 1;

    });

    await chrome.storage.local.set({
        subjects
    });

    const content =
        document.getElementById("content");

    if (!content) {
        console.error("No #content");
        return;
    }

    const container =
        document.createElement("div");

    container.id = "homework-container";
    container.style.padding = "20px";

    const title =
        document.createElement("h1");

    title.textContent =
        "Homework Ordering System";

    container.appendChild(title);

    subjects.forEach(subject => {

        //------------------------------------
        // Entire row
        //------------------------------------

        const subjectRow =
            document.createElement("div");

        subjectRow.style.display = "flex";
        subjectRow.style.gap = "2px";
        // subjectRow.style.marginBottom = "20px";
        subjectRow.style.border = "1px solid var(--sbx-color-border, var(--sbx-config-color-body-background, var(--body-background)))";
        subjectRow.style.alignItems = "stretch";

        //------------------------------------
        // Subject card
        //------------------------------------

        const subjectCard =
            document.createElement("div");

        subjectCard.className =
            "timetable-subject";

        subjectCard.style.width =
            "150px";

        subjectCard.style.minHeight =
            ""
        subjectCard.style.padding =
            "16px 0px 25px 16px";

        subjectCard.style.backgroundColor =
            subject.colour;
        
        subjectCard.style.position =
            "relative";

        subjectCard.innerHTML = `
            <a>${subject.subjectName}</a>
            <br>
            ${subject.teacher}
            <br><br>
            <div style="justify-content:end; position: absolute; bottom: 0; right: 0;">
            <button class="createTask" style="
            
            margin: 50px 0px 0px 38.3px;
            ">
                Create Task
            </button>
            </div>
        `;

        //------------------------------------
        // Task column
        //------------------------------------

        const taskColumn =
            document.createElement("div");

        taskColumn.style.flex = "1";
        taskColumn.style.display = "flex";
        taskColumn.style.flexDirection =
            "column";
        taskColumn.style.gap = "10px";




        (subject.tasks || []).forEach(
            (task, index) => {
            const menuId =
                "poll-options-${subject.subjectName}-${index}";
            function showButtons() {
                document.getElementById(menuId).classList.toggle("show");
            }
            const taskRow =
                document.createElement("div");

            taskRow.style.display = "flex";
            taskRow.style.gap = "10px";
            const taskCard =
                document.createElement("div");
            taskCard.className = "card small-12";
            taskCard.style.backgroundColor = "var(--sbx-config-color-accent, var(--sbx-config-color-accent, var(--accent-foreground)))";
            taskCard.style.color = "var(--sbx-config-color-accent-text, var(--sbx-config-color-active, var(--accent-background)))";


            taskCard.style.padding =
                "15px";

            taskCard.style.borderLeft =
                "5px solid " +
                subject.colour;

            taskCard.setHTMLUnsafe(`
                
                <div style="
                    font-size:32px;
                    color:#4aa3ff;
                    z-index:1;

                ">
                <h3 class="title" style="
                z-index:1;
                position:absolute;

                ">
                    ${task.taskName}
                </h3>
                </div>
                <div id="buttons" style="
                display:flex;
                position:relative;
                justify-content:right;
                ">
                    <button class="icon-modify" style="justify-self:right; padding:8px; margin:0px 8px 0px 0px !important; min-height:2.5rem; font-size:0.875rem; font-weight:600; vertical-align:middle; color:#479AD1; width:102.58px; line-height:1.5rem;"> MODIFY</button>
                    <button class="icon-delete" style="justify-self:right; padding:8px; margin:0px !important; min-height:2.5rem; font-size:0.875rem; font-weight:600; vertical-align:middle; color:#479AD1; width:102.58px; line-height:1.5rem;"> DELETE</button>
                </div>
                        <p class="meta" style="

                    color:#cccccc;

                ">
                    ${subject.subjectName}
                    >
                    Hours:
                    ${task.hours}
                    |
                    Difficulty:
                    ${task.diff}/5

                    |

                    Weighting:
                    ${task.weighting}%

                    |

                    ${task.comp}% complete
                </p>

                <p class="meta" style="
                    color:#9ad14b;
                ">
                    Due ${task.dueDate}
                </p>
            `);
            const priorityBox =
                document.createElement("div");

            priorityBox.style.width =
                "80px";

            priorityBox.style.background =
                "#ef7648";

            priorityBox.style.color =
                "white";

            priorityBox.style.display =
                "flex";

            priorityBox.style.alignItems =
                "center";

            priorityBox.style.justifyContent =
                "center";

            priorityBox.style.fontSize =
                "36px";

            priorityBox.style.fontWeight =
                "bold";

            priorityBox.textContent =
                task.priority;

            //--------------------------------
            // Delete task
            //--------------------------------

            taskCard.querySelector(
                ".icon-delete"
            ).addEventListener(
                "click",
                async () => {

                    const data =
                        await chrome.storage.local.get(
                            "subjects"
                        );

                    const stored =
                        data.subjects;

                    const s =
                        stored.find(
                            x =>
                                x.subjectName ===
                                subject.subjectName
                        );

                    s.tasks.splice(
                        index,
                        1
                    );

                    await chrome.storage.local.set({
                        subjects: stored
                    });

                    buildHomeworkUI();
                }
            );

            //--------------------------------
            // Edit task
            //--------------------------------
            console.log(index, task.taskName);
            taskCard.querySelector(
                ".icon-modify"
            ).addEventListener(
                "click",
                () => {
                    console.log(index, task.taskName);
                    openTaskPopup(
                        subject,
                        task,
                        index
                    );
                }
            );

            taskRow.appendChild(
                taskCard
            );

            taskRow.appendChild(
                priorityBox
            );

            taskColumn.appendChild(
                taskRow
            );
        });
        
        //------------------------------------
        // Create task button
        //------------------------------------

        subjectCard.querySelector(
            ".createTask"
        ).addEventListener(
            "click",
            () => {
                openTaskPopup(subject);
            }
        );

        //------------------------------------
        // Assemble row
        //------------------------------------

        subjectRow.appendChild(
            subjectCard
        );

        subjectRow.appendChild(
            taskColumn
        );

        container.appendChild(
            subjectRow
        );
    });

    const weightingSection =
        await buildWeightingSection();

    container.appendChild(
        weightingSection
    );

    content.after(container);
}

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

            const task = {

                taskName:
                    document.getElementById(
                        "taskName"
                    ).value,

                hours:
                    Number(
                        document.getElementById(
                            "hours"
                        ).value
                    ),

                dueDate:
                    document.getElementById(
                        "dueDate"
                    ).value,

                weighting:
                    Number(
                        document.getElementById(
                            "weighting"
                        ).value
                    ),

                comp:
                    Number(
                        document.getElementById(
                            "comp"
                        ).value
                    ),

                diff:
                    Number(
                        document.getElementById(
                            "diff"
                        ).value
                    )
            };
            const {
                weights = DEFAULT_WEIGHTS
            } = await chrome.storage.local.get("weights");

            const taskHours =
                (Number(task.hours))*weights.hours;

            const taskWeight =
                (1 + Number(task.weighting) / 5)*weights.weight;

            const taskComp =
                (1 - Number(task.comp) / 100)*weights.comp;

            const due =
                new Date(task.dueDate);

            const today =
                new Date();

            const days =
                (Math.max(
                    1,
                    (due - today) /
                    (1000 * 60 * 60 * 24)
                ))*weights.days;

            let taskDiff = 2.5;

            if (
                task.diff === "" ||
                task.diff === null ||
                isNaN(task.diff)
            ) {
                taskDiff = 2.5;
            }
            else {
                taskDiff =
                    (Number(task.diff))*weights.diff / 5 + (1-weights.diff)/5 + 0.5;
            }
            

            task.importance =
                (
                    taskHours /
                    days
                ) *
                taskWeight *
                taskComp *
                taskDiff;
            
            console.log(task.importance);

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

            buildHomeworkUI();
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

document.addEventListener(
    "weightsChanged",
    () => {
        document.getElementById(
            "homework-container"
        )?.remove();
        buildHomeworkUI();
    }
);

buildHomeworkUI();