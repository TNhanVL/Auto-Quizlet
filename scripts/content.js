async function gotMessage(message, sender, sendResponse) {
    switch (message.action) {
        case "getWordAndDefinition": {
            c = [];
            d = {};
            var a = document.getElementsByClassName("SetPageTerm-wordText");
            var b = document.getElementsByClassName("SetPageTerm-definitionText");
            for (let i = 0; i < a.length; i++) {
                c[i] = [a[i].textContent, b[i].textContent];
                d[a[i].textContent] = b[i].textContent;
            }
            chrome.storage.local.set({ dict: c });
            sendResponse();
            break;
        }
        case "auto": {
            while (true) {

                stop = await chrome.storage.local.get(["stop"]);
                if (stop.stop) break;

                //If in flashcard
                var know = document.getElementsByClassName("o1rfl3bx");
                if (know.length) {
                    know[1].click();
                    continue;
                }

                //If have no question in round
                var finished = document.getElementsByClassName("GenericTransitionLayout-transition-enter-done");
                if (finished.length) {
                    var nextButton = document.getElementsByClassName("AssemblyButtonBase AssemblyPrimaryButton--default AssemblyButtonBase--large AssemblyButtonBase--padding");
                    if (nextButton.length == 1) break;
                    nextButton[0].click();
                    nextButton[1].click();
                } else {
                    chrome.storage.local.get(["dict"]).then((result) => {
                        var words = document.getElementsByClassName("a1bncmms");
                        for (let i = 0; i < words.length; i++) {
                            var word = words[i].children[1].textContent;
                            var answer = null;

                            result.dict.forEach(element => {
                                // console.log(element[1] + " | " + word + " | " + (element[1] == word));
                                if (element[0] == word) {
                                    answer = element[1];
                                }
                                if (element[1] == word) {
                                    answer = element[0];
                                }
                            });

                            console.log(word + " " + answer);

                            var b = document.getElementsByClassName("w1uwrq7e");
                            for (let j = i * 4; j < i * 4 + 4; j++) {
                                if (b[j].children[1].textContent == answer) {
                                    b[j].click();
                                    break;
                                }
                            }
                        }

                        if (words.length > 1) {
                            chrome.storage.local.set({ stop: true });
                        }

                    })
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            chrome.storage.local.set({ stop: true });
            break;
        }
    }

}
chrome.runtime.onMessage.addListener(gotMessage)