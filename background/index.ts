const ZORA_ORIGIN = /https:\/\/zora\.co\/collect\/base:(.+)/g

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

// Sidepanel should be activated if the current tab URL matches to the supported Zora URL.
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.status === "loading") {
    if (changeInfo.url) {
      if (changeInfo.url.match(ZORA_ORIGIN)) {
        await chrome.sidePanel.setOptions({
          tabId,
          path: "sidepanel.html",
          enabled: true
        })
      } else {
        await chrome.sidePanel.setOptions({
          tabId,
          enabled: false
        })
      }
    }
  }
})

// When switching tabs if the active tab URL matches supported Zora URL then Sidepanel should be activated.
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, async (tab) => {
    if (tab.url) {
      if (tab.url.match(ZORA_ORIGIN)) {
        await chrome.sidePanel.setOptions({
          tabId: tab.id,
          path: "sidepanel.html",
          enabled: true
        })
      } else {
        await chrome.sidePanel.setOptions({
          tabId: tab.id,
          enabled: false
        })
      }
    }
  })
})
