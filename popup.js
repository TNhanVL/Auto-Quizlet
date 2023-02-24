document.getElementById('btnGetData').addEventListener('click', getData);
document.getElementById('btnAuto').addEventListener('click', startAuto);
document.getElementById('btnStop').addEventListener('click', stopAuto);

updateStatus();
var table = $("#dict");
table.empty();
chrome.storage.local.get(["dict"]).then((result) => {
    result.dict.forEach(element => {
        table.append("<tr><td>" + element[0] + "</td><td>" + element[1] + "</td></tr>");
    });
})

function getData() {
    updateStatus();
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
        if (!tabs[0].url.includes('https://quizlet.com')) {
            chrome.storage.local.set({ stop: true });
            alert('please go to https://quizlet.com')
            return
        }
        chrome.tabs.sendMessage(tabs[0].id, { action: "getWordAndDefinition" }, function (response) {
            var table = $("#dict");
            table.empty();
            chrome.storage.local.get(["dict"]).then((result) => {
                result.dict.forEach(element => {
                    table.append("<tr><td>" + element[0] + "</td><td>" + element[1] + "</td></tr>");
                });
            })
        });
    });
    chrome.storage.local.set({ stop: true });
}

function stopAuto() {
    chrome.storage.local.set({ stop: true });
}

async function updateStatus() {
    document.getElementById('status').innerHTML = "Running...";
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 300));
        stop = await chrome.storage.local.get(["stop"]);
        if (stop.stop) {
            document.getElementById('status').innerHTML = "";
            break;
        }
    }
}

function startAuto() {
    updateStatus();
    chrome.storage.local.set({ stop: false });
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
        if (!tabs[0].url.includes('https://quizlet.com')) {
            chrome.storage.local.set({ stop: true });
            alert('please go to https://quizlet.com')
            return
        }
        chrome.tabs.sendMessage(tabs[0].id, { action: "auto" });
    });
}