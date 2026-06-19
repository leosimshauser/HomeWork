document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("subjectBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: downloadText
    });
  });
});

function downloadText() {
  const initialText = [...new Set(
    Array.from(
      document.querySelectorAll(".timetable-subject a")
    ).map(el => el.innerText.trim())
  )];

  const text = initialText
    .filter(item => !item.includes("HOUSE"))
    .filter(item => !item.includes("SPORT"))
    .concat("MISCELLANEOUS")
    .join("\n");

  const blob = new Blob([text], { type: "text/plain" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "subject-information-do-not-edit.txt";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
}