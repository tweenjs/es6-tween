import puppeteer from 'puppeteer'

const fs = require('fs')
const path = require('path')

// Parse
function describe (jsHandle) {
  return jsHandle.executionContext().evaluate((obj) => {
    // serialize |obj| however you want
    return JSON.stringify(obj)
  }, jsHandle)
}

export default (t, run) => {
  let _browser
  return puppeteer
    .launch({ headless: true, args: ['--no-sandbox'] })
    .then((browser) => {
      _browser = browser
      return browser
        .newPage()
        .then((page) => {
          page.on('console', async (msg) => {
            const args = await Promise.all(msg.args().map((arg) => describe(arg)))
            console.log('Logs from Headless Chrome', ...args)
          })
          return page.evaluate(fs.readFileSync(path.join(__dirname, 'bundled/Tween.js'), 'utf8')).then(() => page)
        })
        .then((page) => run(t, page).then(() => page))
    })
    .then((page) => {
      _browser.close()
      page.close()
    })
}
