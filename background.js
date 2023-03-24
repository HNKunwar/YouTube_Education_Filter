let scriptTag = null;

const checkForChanges = async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || !tab.url.startsWith("https://www.youtube.com/watch?v=")) {
      return;
    }

    const [response] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const scriptTagElement = document.getElementById("scriptTag");
        return scriptTagElement ? scriptTagElement.textContent : null;
      },
    });

    const newScriptTag = response.result;
    if (newScriptTag !== scriptTag) {
      scriptTag = newScriptTag;
      chrome.tabs.sendMessage(tab.id, { type: "checkEducationCategory" });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'filterStatusChanged') {
    checkForChanges();
  }
});

setInterval(checkForChanges, 2000);
