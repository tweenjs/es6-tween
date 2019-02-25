import puppeteer from 'puppeteer'

const fs = require('fs')
const path = require('path')

export default (t, run) => {
  let _browser
  return puppeteer.launch({ headless: true, args: ['--no-sandbox'] }).then(browser => {
    _browser = browser
    return browser.newPage().then(page => {
      return page.evaluate(
        fs.readFileSync(path.join(__dirname, 'bundled/Tween.js'), 'utf8')
      ).then(() => page)
    }).then((page) => {
      return run(t, page).then(() => page)
    })
  })
    .then((page) => {
      _browser.close()
      page.close()
    })
}
