let scriptTag = null;

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
      chrome.tabs.sendMessage(tab.id, { type: "checkEducationCategory" });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

setInterval(checkForChanges, 2000);
