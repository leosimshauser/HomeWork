console.log("weighting.js loaded");

window.DEFAULT_WEIGHTS = {
    days: 1,
    hours: 1,
    diff: 1,
    weight: 1,
    comp: 1
};

async function buildWeightingSection() {

    const data =
        await chrome.storage.local.get("weights");

    const weights =
        data.weights || window.DEFAULT_WEIGHTS;

    const section =
        document.createElement("div");

    section.id = "weighting-section";

    section.style.marginTop = "50px";
    section.style.padding = "20px";
    section.style.backgroundColor = "var(--layer1, var(--sbx-color-foreground-primary, #fff))";
    section.style.color = "var(--text1) !important";

    section.innerHTML = `
        <h2>
            Change weighting of variables
        </h2>

        <p>
            These settings affect how task priority
            is calculated.
        </p>
    `;

    section.appendChild(
        createSlider(
            "Days until due",
            "days",
            weights.days
        )
    );

    section.appendChild(
        createSlider(
            "Hours required",
            "hours",
            weights.hours
        )
    );

    section.appendChild(
        createSlider(
            "Difficulty",
            "diff",
            weights.diff
        )
    );

    section.appendChild(
        createSlider(
            "RT/SAC weighting",
            "weight",
            weights.weight
        )
    );

    section.appendChild(
        createSlider(
            "Completion",
            "comp",
            weights.comp
        )
    );

    const alertRow =
        document.createElement("div");
    alertRow.id = "alertMessage";
    alertRow.textContent = "";
    alertRow.style.fontWeight = "600";
    alertRow.style.fontSize = "18px";
    alertRow.style.color = "var(--sbx-config-color-accent,var(--sbx-config-color-accent,var(--sbx-config-color-accent,var(--content-ui-foreground))))";

    section.appendChild(alertRow)

    const buttonRow =
        document.createElement("div");

    buttonRow.style.marginTop = "20px";
    buttonRow.style.display = "flex";
    buttonRow.style.gap = "10px";

    const reset =
        document.createElement("button");

    reset.textContent = "Reset";

    reset.onclick = resetWeights;

    const save =
        document.createElement("button");

    save.textContent = "Save";

    save.onclick = saveWeights;

    buttonRow.appendChild(reset);
    buttonRow.appendChild(save);

    section.appendChild(buttonRow);

    return section;
}

function createSlider(title, id, currentWeight) {

    const wrapper =
        document.createElement("div");

    wrapper.innerHTML = `
        <label>${title}</label>

        <input
            class="c-input-range__input"
            id="${id}-slider"
            type="range"
            min="0"
            max="4"
            step="1"
            value="${weightToSlider(currentWeight)}"
            style="
            width:100%;
            ">

        <div id="levels" style="width:100%;">
            <span id="level">Very Low</span>
            <span id="level" class="low">Low</span>
            <span id="level">Average</span>
            <span id="level" class="high">High</span>
            <span id="level">Very High</span>
        </div>

        <br>
        <style>
        #level {
            width: 69px;
            text-align:center;
        }
        .low {
            text-align:left !important;
            padding-left: 10px;
        }
        .high {
            text-align:right !important;
            padding-right: 10px;
        }
        #levels {
            display: grid;
            grid-auto-flow: column;
            justify-content: space-between;
        }

        </style>
    `;

    return wrapper;
}


    // Reads slider values and saves them to chrome.storage.local
async function saveWeights() {

    const weights = {

        days: sliderToWeight(Number(document.getElementById("days-slider").value)),
        hours: sliderToWeight(Number(document.getElementById("hours-slider").value)),
        diff: sliderToWeight(Number(document.getElementById("diff-slider").value)),
        weight: sliderToWeight(Number(document.getElementById("weight-slider").value)),
        comp: sliderToWeight(Number(document.getElementById("comp-slider").value))

    };

    await chrome.storage.local.set({
        weights
    });

    document.dispatchEvent(
        new Event("weightsChanged")
    );


}



    // Resets all sliders to the default position
function resetWeights() {

    document.getElementById("days-slider").value =
        weightToSlider(window.DEFAULT_WEIGHTS.days);

    document.getElementById("hours-slider").value =
        weightToSlider(window.DEFAULT_WEIGHTS.hours);

    document.getElementById("diff-slider").value =
        weightToSlider(window.DEFAULT_WEIGHTS.diff);

    document.getElementById("weight-slider").value =
        weightToSlider(window.DEFAULT_WEIGHTS.weight);

    document.getElementById("comp-slider").value =
        weightToSlider(window.DEFAULT_WEIGHTS.comp);

    saveWeights();

}



    // Converts slider positions (0-4) to multipliers (0.5-1.5)
function sliderToWeight(position) {

    switch (position) {

        case 0:
            return 0.25;

        case 1:
            return 0.5;

        case 2:
            return 1;

        case 3:
            return 1.5;

        case 4:
            return 1.75;

        default:
            return 1;
    }
}



    // Converts multipliers back to slider positions
function weightToSlider(weight) {

    switch (weight) {

        case 0.25:
            return 0;

        case 0.5:
            return 1;

        case 1:
            return 2;

        case 1.5:
            return 3;

        case 1.75:
            return 4;

        default:
            return 2;
    }
}