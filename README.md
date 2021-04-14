# heropost-login

Prérequis :
Ceux de Puppeteer : https://github.com/puppeteer/puppeteer

Installation :
```
npm install pierreminiggio/heropost-login
```

Utilisation : 
```javascript
import login from '@pierreminiggio/heropost-login'

const page = ...
await login(page, 'Heropost login or email', 'Heropost password')
```
