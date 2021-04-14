import puppeteer from 'puppeteer'

/**
 * @param {puppeteer.Page} page
 * @param {string} login
 * @param {string} password
 * 
 * @returns {Promise}
 */
export default function (page, login, password) {

    return new Promise(async (resolve, reject) => {
        
        try {
            await page.goto('https://dashboard.heropost.io/login')

            const loginInputSelector = '[name="email"]'
            const passwordInputSelector = '[name="password"]'
            await page.waitForSelector(loginInputSelector)
            await page.waitForSelector(passwordInputSelector)

            await page.evaluate((login, password, loginInputSelector, passwordInputSelector) => {
                document.querySelector(loginInputSelector).value = login
                document.querySelector(passwordInputSelector).value = password
            }, login, password, loginInputSelector, passwordInputSelector)
            
            const submitButtonSelector = 'button[type="submit"]'

            await page.evaluate(submitButtonSelector => {
                document.querySelector(submitButtonSelector).click()
            }, submitButtonSelector)

            await page.waitForSelector('.user-name')

            resolve()
        } catch (e) {
            reject(e)
        }
    })
}
