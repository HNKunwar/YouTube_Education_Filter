const isVideoPage = () => {
  const videoRegex = /^https:\/\/www\.youtube\.com\/watch\?v=/;
  return videoRegex.test(window.location.href);
};

const checkEducationCategory = () => {
  if (!isVideoPage()) {
    return;
  }

  chrome.storage.sync.get(['filterEnabled'], (result) => {
    if (!result.filterEnabled) {
      return;
    }

    const scriptTag = document.getElementById('scriptTag');

    if (scriptTag) {
      const metadata = JSON.parse(scriptTag.textContent);
      if (metadata.genre !== 'Education') {
        window.location.href = 'https://www.youtube.com/';
      }
    }
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'checkEducationCategory') {
    checkEducationCategory();
  }
});
