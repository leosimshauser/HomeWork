document.addEventListener("DOMContentLoaded", async () => {

    // Load existing subjects when popup opens
const stored =
    (await chrome.storage.local.get("subjects")).subjects;

    const subjectObjects =
        Array.isArray(stored)
            ? stored.map(
                s => new Subject(
                    s.subjectName,
                    s.teacher,
                    s.colour
                )
            )
            : [];

    console.log("Stored subjects:", stored);
    console.log("Subject objects:", subjectObjects);

    document.getElementById("subjectBtn")
        .addEventListener("click", getSubjects);

    document.getElementById("showSubjectsBtn")
        .addEventListener("click", showSubjects);
});

async function getSubjects() {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    const url = new URL(tab.url);

    if (url.pathname !== "/timetable") {
        alert("Please open the SchoL timetable page first.");
        return;
    }

    const results =
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scrapeSubjects
        });

    const result = results[0].result;

    await chrome.storage.local.set({
        subjects: result
    });
}

function scrapeSubjects() {

    const seen = new Set();
    const subjects = [];

    document.querySelectorAll(".timetable-subject").forEach(el => {

        const link = el.querySelector("a");

        if (!link) return;

        const subjectName = link.innerText.trim();

        if (
            subjectName.includes("HOUSE") ||
            subjectName.includes("SPORT")
        ) {
            return;
        }

        if (seen.has(subjectName)) {
            return;
        }

        seen.add(subjectName);

        const colour =
            getComputedStyle(el).backgroundColor;

        const lines =
            el.querySelector("div")
            ?.innerText
            .split("\n")
            .filter(line => line.trim() !== "") || [];

        const teacherLine = lines[1] || "";

        const teacher =
            teacherLine.replace(/^\S+\s+/, "");

        subjects.push({
            subjectName,
            teacher,
            colour,
            tasks: []
        });
    });

    subjects.push({
        subjectName: "MISCELLANEOUS",
        teacher: "",
        colour: "rgb(200,200,200)",
        tasks: []
    });

    return subjects;
}

async function showSubjects() {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    const url = new URL(tab.url);

    if (url.pathname !== "/calendar/week") {
        alert("Please open the SchoL eDiary page first.");
        return;
    }
    else {
        try {

            await chrome.tabs.sendMessage(tab.id, {
                action: "showHomework"
            });

        } catch (err) {

            if (err.message.includes("Receiving end does not exist")) {

                console.log("Content script missing. Injecting...");

                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: [
                        "classes.js",
                        "hoursSect.js",
                        "weighting.js",
                        "taskPopup.js",
                        "content.js"
                    ]
                });

                await chrome.tabs.sendMessage(tab.id, {
                    action: "showHomework"
                });

            } else {
                console.error(err);
            }
        }
    }
}