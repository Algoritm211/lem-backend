# Run app on your local machine

1. Clone client-side of app on your computer from [HERE](https://github.com/Algoritm211/platform-lem) (All instruction about client settings you can find also in README in client-side repository)
2. Clone server-side (this repository)
3. Run `npm install` to install all libraries (dependencies) of project
4. In server folder create file `.env`. There you must add this
```js
secretKey=<secretKey>
dbURL=<url> // Your Mongo Atlas DB URL, Example: mongodb+srv://<userlogin>:<password>@cluster0.udmsc.mongodb.net/<dbname>?retryWrites=true&w=majority
```
4. Run `npm run dev` to run app in development mode
