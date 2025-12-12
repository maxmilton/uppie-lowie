/// <reference lib="webworker" /

function mutatePageText() {
  const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const segmenter = new Intl.Segmenter();
  const letterRegex = /\p{Letter}/u;

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    const text = node.nodeValue;

    if (text) {
      node.nodeValue = [...segmenter.segment(text)]
        // eslint-disable-next-line no-confusing-arrow
        .map(({ segment: char }) =>
          letterRegex.test(char)
            ? Math.random() > 0.5
              ? char.toUpperCase()
              : char.toLowerCase()
            : char,
        )
        .join("");
    }
  }
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.id && !tab.url?.includes("chrome://")) {
    void chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: mutatePageText,
    });
  }
});
