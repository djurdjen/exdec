# Exdec

```
yarn install
```

## Project setup Node

Create a `.env` duplicate from the `.env.example` file.<br>
Be sure to create a MySQL database and fill the `.env` with its credentials.<br>
To be able to send your travel expenses by e-mail you'll need a Mailgun account : https://signup.mailgun.com/new/signup

### Watch and run node on port 3000

```
yarn run start
```

### Seed tables

```
yarn run seed
```

### Run Vue dev server

proxy is set on http://localhost:3000 in vue.config.js

```
yarn dev
```

### Compiles and minifies for production

Run this if you want to view the app on port 3000

```
yarn run build
```
