let globalConfig = null

function findUrl(initialConfig, text) {
  const path = text.split(' ')
  return path.reduce((last, current) => {
    if (last) {
      return last[current] ||
             (last['%0'] && last['%0'].replace(/%0/g, current)) ||
             null
    }

    return last
  }, initialConfig)
}

function findSuggestions(config, text) {
  const path = text.split(' ')
  return path.reduce((last, current, index, array) => {
    if (index === array.length - 1) return last

    return {
      obj: last.obj[current],
      path: last.path + ' ' + current
    }
  }, {
    obj: config,
    path: ''
  })
}

function getConfig() {
  return new Promise((resolve, reject) => {
    if (globalConfig) {
      return resolve(globalConfig)
    }
    chrome.storage.sync.get({
      omniboxGoJSON: null
    }, items => {
      if (!items.omniboxGoJSON) return reject(null)

      globalConfig = JSON.parse(items.omniboxGoJSON)
      
      resolve(globalConfig)
    })
  })
}

chrome.omnibox.onInputEntered.addListener(text => {
  getConfig()
    .then(config => {
      const url = findUrl(config, text)
      if (url) {
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, tab => {
          chrome.tabs.update(tab.id, {url})
        })
      }
    })
})

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  getConfig()
    .then(config => {
      const { obj, path } = findSuggestions(config, text)
      if (obj) {
        suggest(Object.keys(obj).map(key => ({
          content: `${path.trim()} ${key}`,
          description: key
        })))
      }
    })
})
