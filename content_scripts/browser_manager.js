(() => {
    if (window.browserManagerHasRun) {
        return;
    }
    window.browserManagerHasRun = true;

    function generateJson() {
        ls = {};
        for (var i = 0; i < localStorage.length; i++) {
            k = localStorage.key(i);
            ls[k] = localStorage.getItem(k);
        }
        ss = {};
        for (var i = 0; i < sessionStorage.length; i++) {
            k = sessionStorage.key(i);
            ss[k] = sessionStorage.getItem(k);
        }
        stor = [ls, ss];
        return JSON.stringify(stor);
    }

    function handleResponse(message) {
        console.log(`Message from the background script: ${message.response}`);
    }

    function handleError(error) {
        console.log(`Error: ${error}`);
    }

    function action_download(text) {
        browser.runtime.sendMessage({
            type: 'download',
            body: text
        }).then(handleResponse).catch(handleError);
    }

    function loadIntoStorage(stor) {
        s = JSON.parse(stor);
        ls = s[0];
        ss = s[1];
        for (var k in ls) {
            localStorage.setItem(k, ls[k]);
        }
        for (var k in ss) {
            sessionStorage.setItem(k, ss[k]);
        }
    }

    browser.runtime.onMessage.addListener((message) => {
        console.log(message)
        if (message.command == "upload") {
            console.log(message)
            loadIntoStorage(message.data);
        } else if (message.command == "download") {
            action_download(generateJson());
        }
    });
})();
