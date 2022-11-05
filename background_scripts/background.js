
async function handleMessage(request, sender, sendResponse) {
    if (request.type == 'download') {
        var blob = new Blob([request.body], { type: 'text/plain' });
        var url = window.URL.createObjectURL(blob);
        await browser.downloads.download({
            url: url,
            filename: 'storage.json',
            saveAs: true
        });
        return Promise.resolve({response: "Downloaded successfully!"});
    } else {
        return Promise.reject({response: `Invalid request type: ${request.type}`})
    }
}

browser.runtime.onMessage.addListener(handleMessage);
