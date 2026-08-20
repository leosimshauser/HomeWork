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
    
    const textDisp =
        document.createElement("h2");
    textDisp.textContent =
        "AVERAGE HOURS STUDYING PER DAY";
    
    const hoursDiv =
        document.createElement("div")
    hoursDiv.id =
        "hoursDisp";
    hoursDiv.style.width =
        "150px";
    hoursDiv.style.minHeight =
        "60px";
    hoursDiv.style.color =
        "white";
    hoursDiv.style.display =
        "flex";
    hoursDiv.style.alignItems =
        "center";
    hoursDiv.style.justifyContent =
        "center";
    hoursDiv.style.fontSize =
        "1rem";
    hoursDiv.style.fontWeight =
        "bold";
    h = totAveHours.toFixed(1);
    if (h < 4) {
        hoursDiv.textContent =
        h;
    }
    else {
        hoursDiv.textContent =
        `${h}!`;
    }
    
    if (h<=0.5) {
        hoursDiv.style.backgroundColor = "#549a63";
    }
    else if (h<=1 && h>0.5) {
        hoursDiv.style.backgroundColor = "#4fa74f";
    }
    else if (h<=1.5 && h>1) {
        hoursDiv.style.backgroundColor = "#7cc047";
    }
    else if (h<=2 && h>1.5) {
        hoursDiv.style.backgroundColor = "#c2d344";
    }
    else if (h<=3 && h>2) {
        hoursDiv.style.backgroundColor = "#e4b144";
    }
    else {
        hoursDiv.style.backgroundColor = "#f36f45";
    }    
    section.appendChild(textDisp);
    section.appendChild(hoursDiv);

    
    return section;

}