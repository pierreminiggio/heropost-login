// Copy this file to test.js
// You can then test using npm test

import login from './index.js'

(async () => {
    console.log(await login(
        'Heropost login or email',
        'Heropost password',
    ))
})()
