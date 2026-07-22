console.log("content.js loaded v2");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log("Received message:", message);

    if (message.action === "showHomework") {
        buildHomeworkUI();
        sendResponse({ success: true });
    }
    return true;
});

async function buildHomeworkUI() {
    console.log("buildHomeworkUI called");
    document
        .querySelectorAll("#homework-container")
        .forEach(container => container.remove());

    const { subjects = [] } =
        await chrome.storage.local.get(
            "subjects"
        );

    const {
        weights = window.DEFAULT_WEIGHTS
    } = await chrome.storage.local.get("weights");

    await chrome.storage.local.set({
        subjects
    }); 
const tasks = [];

subjects.forEach(subject => {

    (subject.tasks || []).forEach((task, index) => {

        const taskObj = new Task(
            task.taskName,
            task.hours,
            task.dueDate,
            task.weighting,
            task.comp,
            task.diff
        );

        taskObj.calculateImportance(weights);
        taskObj.calculateAveHours();

        subject.tasks[index] = taskObj;
    });

});

subjects.forEach(subject => {

    subject.tasks.forEach(task => {

        tasks.push({
            subject: subject.subjectName,
            task: task
        });

    });

});
    const sortedTasks = sortTasks(tasks);

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
        subjectCard.style.padding =
            "16px 0px 25px 16px";

        subjectCard.style.backgroundColor =
            subject.colour;
        
        subjectCard.style.position =
            "relative";

        subjectCard.innerHTML = `
            <a href="${subject.subjectLink}">${subject.subjectName}</a>
            <br>
            ${subject.teacher}
            <br><br>
            <div style="justify-content:end; position: absolute; bottom: 0; left: 0;">
            <button class="createTask" id="tskButton"style="
            margin: 50px 0px 0px 0px;
            ">
                Create Task
            </button>
            </div>
            <style>
            #tskButton {
                background-color: transparent !important;
            }
            #tskButton:hover {
                background-color: #d1ebfe !important;
            }
            </style>
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
        taskColumn.style.gap = "2px";




        (subject.tasks || []).forEach(
            (task, index) => {
            const menuId =
                `poll-options-${subject.subjectName}-${index}`;
            function showButtons() {
                document.getElementById(menuId).classList.toggle("show");
            }
            const taskRow =
                document.createElement("div");

            taskRow.style.display = "flex";
            taskRow.style.minHeight = "145px";
            taskRow.style.gap = "2px";
            const taskCard =
                document.createElement("div");
            taskCard.className = "card small-12";
            taskCard.style.backgroundColor = "var(--sbx-color-foreground-primary, #fff)";
            taskCard.style.color = "var(--sbx-config-color-accent-text, var(--sbx-config-color-active, var(--accent-background)))";


            taskCard.style.padding =
                "15px";

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

                    color:var(--sbx-config-color-accent,var(--sbx-config-color-accent,var(--sbx-config-color-accent,var(--content-ui-foreground))));

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
            if (task.priority == 1) {
                priorityBox.style.backgroundColor = "#f36f45"
            }
            else if (task.priority === 2) {
                priorityBox.style.backgroundColor = "#e4b144"
            }
            else if (task.priority === 3) {
                priorityBox.style.backgroundColor = "#c2d344"
            }
            else if (task.priority === 4) {
                priorityBox.style.backgroundColor = "#7cc047"
            }
            else if (task.priority === 5) {
                priorityBox.style.backgroundColor = "#4fa74f"
            }
            else {
                priorityBox.style.backgroundColor = "#549a63"
            }

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
            console.log(task.priority)
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
    const hoursSection =
        await buildHoursSection(sortedTasks);
    
    container.appendChild(
        hoursSection
    );
    const weightingSection =
        await buildWeightingSection();

    container.appendChild(
        weightingSection
    );

    content.after(container);
}



document.addEventListener(
    "weightsChanged",
    () => {
        document
            .querySelectorAll("#homework-container")
            .forEach(container => container.remove());
        buildHomeworkUI();
    }
);

document.addEventListener(
    "tasksUpdated",
    buildHomeworkUI
);

