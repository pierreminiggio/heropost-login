// Copy this file to test.js
// You can then test using npm test

import puppeteer from 'puppeteer'
import login from './index.js'

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--disable-notifications',
            '--no-sandbox'
        ]
    })
    const page = await browser.newPage()
    console.log(await login(
        page,
        'Heropost login or email',
        'Heropost password',
    ))
})()
