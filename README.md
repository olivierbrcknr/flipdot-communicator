# Flip Dot Communicator — Distant Socializing



## The UI

The website is split into to halves: The left side is the *Main UI* which is meant as the *input* of the communication. The right side is the *Virtual Flip Dot*, which is a virtual representation of the hardware to test the interaction.

### Main UI

#### Input Commands

##### Send Hello

A little "hello world" example, sending one simple interaction to the communicator to display


#### Selection Toggle

- *physical* – Sends your message to all website instances and the hardware prototype
- *virtual* — Sends your message to all website instances
- *test* — Sends your message just to your website instance

### Virtual Flip Dot


## Development

This is a [next.js](https://nextjs.org/) repository using [yarn](https://yarnpkg.com/). Download it, open it in your terminal and hit `yarn install`.

### Testing

Open the repository in the terminal. Run the following command to run the development server, which should open at [http://localhost:3000/](http://localhost:3000/).

```sh
yarn dev
```

### Firebase Integration

This project saves data to [Google's Firebase](https://firebase.google.com/). The credentials are handled within a `.env`, which should be set up like this:

```env
FIREBASE_MEASUREMENT_ID="value"
FIREBASE_APP_ID="value"
FIREBASE_MESSAGING_SENDER_ID="value"
FIREBASE_STORAGE_BUCKET="value"
FIREBASE_PROJECT_ID="value"
FIREBASE_DATABASE_URL="value"
FIREBASE_AUTH_DOMAIN="value"
FIREBASE_API_KEY="value"
````