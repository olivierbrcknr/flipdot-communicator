# Website — FlipDot Communicator

The layout is split into to halves: The left side is the *Main UI* which is meant as the *input* of the communication. The right side is the *Virtual Flip Dot*, which is a virtual representation of the hardware to test the interaction.

### Input Commands

#### Send Hello

A little "hello world" example, sending one simple interaction to the communicator to display

#### Ask For Coffee [icon]

Sends over an icon that is displayed on the other matrix. A little icon could help to communicate similarly as emojis do. The icons are created in [this file](website/components/VirtualFlipDot/icons.js) in form of arrays within an object:

```js
const icons = {
  cup: [
    0,0,1,1,1,1,1,1,0,0,
    0,0,1,0,0,0,0,1,1,1,
    0,0,1,0,0,0,0,1,0,1,
    0,0,1,0,0,0,0,1,0,1,
    0,0,1,0,0,0,0,1,1,0,
    0,0,1,0,0,0,0,1,0,0,
    0,0,0,1,1,1,1,0,0,0
  ]
}
```


#### Send Stars [animation/motion]

Similarly to the icon command, this one displays an array of icons, thus displaying a small keyframe animation.

#### Draw [array]

The draw component allows to send individual messages. They are translated into arrays, similar to the icons.

### Selection Toggle

- *physical* – Sends your message to all website instances and the hardware prototype
- *virtual* — Sends your message to all website instances
- *test* — Sends your message just to your website instance

### Virtual Flip Dot

The virtual *FlipDot Communicator* (on the right) should behave exactly like [the physical one](hardware/README.md). All interaction elements are the same. The only actual input is the small button at the bottom right.

## Development

![Architecture](docs/SoftwareArchitecture.svg)

### Setup

This is a [next.js](https://nextjs.org/) repository using [yarn](https://yarnpkg.com/). Download it, open it in your terminal and hit `yarn install`.

### Testing

Open the repository in the terminal. Run the following command to run the development server, which should open at [http://localhost:3000/](http://localhost:3000/).

```sh
yarn dev
```

### Firebase Integration

This project saves data to [Google's Firebase](https://firebase.google.com/) realtime database. The credentials are handled within a `.env` file located in the website's root folder, which should be set up like this:

```env
FIREBASE_MEASUREMENT_ID="value"
FIREBASE_APP_ID="value"
FIREBASE_MESSAGING_SENDER_ID="value"
FIREBASE_STORAGE_BUCKET="value"
FIREBASE_PROJECT_ID="value"
FIREBASE_DATABASE_URL="value"
FIREBASE_AUTH_DOMAIN="value"
FIREBASE_API_KEY="value"
```