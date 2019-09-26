function updateStore(storeKey, data) {
    let obj = {}
        obj[storeKey] = JSON.stringify(data)
    chrome.storage.sync.set(obj)
} 
function readStore(storeKey,cb) {
    chrome.storage.sync.get(storeKey, result => {
        let d = null
    
        if(result[storeKey])
            d = JSON.parse(result[storeKey])
        if( typeof(d) === 'object' )
            cb(d)
    });
}
function init(data) {
    toggleDaylight(!data.isNight)
}
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const key = 'rhugtkeldibnridrlerlgcrrdvneevit'
  
let defaultData = {
    "notepadContent": "",
}

readStore(key, d => {
    let data
  
    if(d) {
        data = d
    }
    else {
        local = localStorage.getItem(key)

        if(local) {
            try {
                data = JSON.parse(local)
                updateStore(key,local)
            }
            catch(e) {
                data = defaultData
                data.notepadContent = localStorage.getItem(key)
                updateStore(key, data)
            }
            localStorage.removeItem(key)
        }
        if( ! data ) {
            data = defaultData
        }
    }
    start(data)
  })
  
function listenerUpdate() {
    readStore(key, d => {
        document.querySelector('.notepad').innerHTML = d.notepadContent
    })
}
function start(data) {
    let now = new Date()
    let timeString = `${weekdays[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`
  
    let g = document.querySelector('.welcome')
    g.innerHTML = `${timeString}`
  
    let n = document.querySelector('.notepad')
    n.innerHTML = data["notepadContent"]
  
    n.addEventListener('input', e => {
        if(n !== document.activeElement || !windowIsActive) return
    
        let obj = Object.assign(data, {
            notepadContent: n.value
        })
    
        updateStore(key, obj)
    })
  
    let windowIsActive

    let storeListener = setInterval(listenerUpdate, 1000)
  
    window.onfocus = function () {
        windowIsActive = true
    }
    window.onblur = function () {
        windowIsActive = false
        if(storeListener) {
            clearInterval(storeListener)
        }
        storeListener = setInterval(listenerUpdate, 1000)
    }
    n.addEventListener('blur', e => {
        if(storeListener) {
            clearInterval(storeListener)
        }
        storeListener = setInterval(listenerUpdate, 1000)
    })
    n.addEventListener('focus', e => {
        if(storeListener) {
            clearInterval(storeListener)
        }
    })
}