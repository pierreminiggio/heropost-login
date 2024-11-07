import puppeteer from 'puppeteer'

/**
 * @typedef {Object} OtherPuppeteerOptions
 *
 * @property {import('puppeteer').Product|undefined} product
 * @property {Record<string, unknown>|undefined} extraPrefsFirefox
 */

/**
 * @param {string} login
 * @param {string} password
 * @param {import('puppeteer').LaunchOptions & import('puppeteer').BrowserLaunchArgumentOptions & import('puppeteer').BrowserConnectOptions & OtherPuppeteerOptions} overrideLaunchOptions
 *
 * @returns {Promise<import('puppeteer').Page|undefined>}
 */
export default function (login, password, overrideLaunchOptions = {}) {

    return new Promise(async (resolve, reject) => {
        
        try {
            const launchOptions = {
                headless: true,
                ignoreHTTPSErrors: true,
                args: [
                    '--disable-notifications',
                    '--no-sandbox',
                    '--window-size=1600,900'
                ]
            }

            for (const overrideLaunchOptionKey in overrideLaunchOptions) {
                launchOptions[overrideLaunchOptionKey] = overrideLaunchOptions[overrideLaunchOptionKey]
            }

            const browser = await puppeteer.launch(launchOptions)

            const pages = await browser.pages()

            /** @var {puppeteer.Page} page */
            let page

            if (! pages) {
                page = await browser.newPage()
            } else {
                page = pages[0]
            }

            await page.setViewport({
                width: 1600,
                height: 900,
                eviceScaleFactor: 1
            })

            await page.goto('https://login.heropost.io/Account/Login')

            const loginInputSelector = '#Email'
            const passwordInputSelector = '#Password'
            await page.waitForSelector(loginInputSelector)
            await page.waitForSelector(passwordInputSelector)

            await page.evaluate((login, password, loginInputSelector, passwordInputSelector) => {
                document.querySelector(loginInputSelector).value = login
                document.querySelector(passwordInputSelector).value = password
            }, login, password, loginInputSelector, passwordInputSelector)
            
            const submitButtonSelector = 'button[name="button"][value="login"]'

            await page.evaluate(submitButtonSelector => {
                document.querySelector(submitButtonSelector).click()
            }, submitButtonSelector)

            try {
                await page.waitForSelector('.MuiTypography-h1')
            } catch (e) {
                const errorSelector = '.validation-summary-errors'
                const errorText = await page.evaluate(errorSelector => {
                    const errorBox = document.querySelector(errorSelector)

                    if (! errorBox) {
                        return null
                    }

                    const errorText = errorBox.innerText

                    if (! errorText) {
                        return null
                    }

                    return errorText
                }, errorSelector)

                await browser.close()
                throw Error(errorText)
            }

            resolve(page)
        } catch (e) {
            reject(e)
        }
    })
}
