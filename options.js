function save_options() {
  const json = document.getElementById('omnibox-go-json').value;
  try {
    JSON.parse(json)
    chrome.storage.sync.set({
      omniboxGoJSON: json
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    })
  } catch {
    var status = document.getElementById('status');
      status.textContent = 'Invalid JSON.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
  }
}

function restore_options() {
  chrome.storage.sync.get({
    omniboxGoJSON: '{}'
  }, function(items) {
    document.getElementById('omnibox-go-json').value = items.omniboxGoJSON;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);