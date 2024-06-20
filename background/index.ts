const ZORA_ORIGIN = /https:\/\/zora\.co\/collect\/base:(.+)/g

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, async (tab) => {
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
  })
})
