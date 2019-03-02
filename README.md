# Node vue starter

```
yarn install
```

## Project setup Node

### Watch and run node on port 3000

```
yarn run start
```

### Seed tables (make sure to create a databse first and fill the credentials in the .env file)

```
yarn run seed
```

### Run Vue dev server

proxy is set on http://localhost:3000 in vue.config.js

```
yarn dev
```

For now use postman to create a user: http://localhost:3000/api/register<br>
Endpoint accepts "username" and "password" as fields

### Compiles and minifies for production

Run this if you want to view the app on port 3000

```
yarn run build
```
