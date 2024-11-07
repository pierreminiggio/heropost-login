import puppeteer from 'puppeteer'

/**
 * @param {string} login
 * @param {string} password
 * 
 * @returns {Promise}
 */
export default function (login, password) {

    return new Promise(async (resolve, reject) => {
        
        try {
            const browser = await puppeteer.launch({
                headless: false,
                args: [
                    '--disable-notifications',
                    '--no-sandbox',
                    '--window-size=1600,900'
                ]
            })

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

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 OPR/114.0.0.0')
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

            await page.waitForTimeout(90000)
            await page.waitForTimeout(90000)
            await page.waitForTimeout(90000)

            resolve()
        } catch (e) {
            reject(e)
        }
    })
}
