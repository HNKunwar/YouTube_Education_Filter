let scriptTag = null;
let contentScriptReady = false;

const checkForChanges = async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if the URL is YouTube video page, and skip execution if it's not
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
      if (contentScriptReady) {
        chrome.tabs.sendMessage(tab.id, { type: "checkEducationCategory" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const sendUpdateFilterStatusMessage = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'updateFilterStatus' });
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'contentScriptReady') {
    contentScriptReady = true;
  } else if (request.type === 'changeFilterStatus') {
    contentScriptReady = request.enabled;
    sendUpdateFilterStatusMessage();
  }
});

setInterval(checkForChanges, 2000);
