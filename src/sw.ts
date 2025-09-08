function mutatePageText() {
  const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    const text = node.nodeValue;

    if (text?.trim()) {
      // eslint-disable-next-line no-confusing-arrow
      node.nodeValue = Array.from(text, (char) =>
        Math.random() < 0.5 ? char.toUpperCase() : char.toLowerCase(),
      ).join("");
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
