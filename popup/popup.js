const toggleButton = document.getElementById('toggleFilter');

const updateToggleButton = () => {
  chrome.storage.sync.get(['filterEnabled'], (result) => {
    if (result.filterEnabled) {
      toggleButton.classList.add('filterActive');
      toggleButton.textContent = 'Disable Filter';
    } else {
      toggleButton.classList.remove('filterActive');
      toggleButton.textContent = 'Enable Filter';
    }
  });
};

toggleButton.addEventListener('click', () => {
  chrome.storage.sync.get(['filterEnabled'], (result) => {
    const newStatus = !result.filterEnabled;
    chrome.storage.sync.set({ filterEnabled: newStatus }, () => {
      chrome.runtime.sendMessage({ type: 'filterStatusChanged' });
      updateToggleButton();
    });
  });
});

updateToggleButton();
