
function setupListeners() {
  document.querySelector('.storage-download').addEventListener('click', (e) => {
    function download(tabs) {
      browser.tabs.sendMessage(tabs[0].id, { command: 'download' });
    }

    function reportError(error) {
      console.error(`Could not download: ${error}`);
    }
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(download)
      .catch(reportError);
  });


  document.querySelector('.storage-upload')
    .addEventListener('click', (e) => {
      document.querySelector('#storage-upload-field').click()
    });

  document.querySelector('#storage-upload-field')
    .addEventListener('click', (e) => {
      e.stopPropagation();
    });

  document.querySelector('#storage-upload-field')
    .addEventListener('change', (e) => {
      function reportError(error) {
        console.error(`Could not upload: ${error}`);
      }
      function upload(tabs) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = async (readerEvent) => {
          var content = readerEvent.target.result;
          console.log(content);
          await browser.tabs.sendMessage(tabs[0].id, { command: 'upload', data: content }).catch(reportError);
          browser.tabs.reload(tabs[0].id)
        }
      }
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(upload)
        .catch(reportError);
    });

}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute browser_manager content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs
  .executeScript({ file: "/content_scripts/browser_manager.js" })
  .then(setupListeners)
  .catch(reportExecuteScriptError);
