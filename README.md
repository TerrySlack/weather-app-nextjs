This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

The app was created with yarn 1.22.x. If you want to use another builder, delete the yarn.lock file

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This is a simple weather app. Type in the name of a city and the details will be displayed.
A button will also be generated with the city name. If in the future you wish to revisit that city, press the button and
the data for it will be displayed.
If the incorrect city name is typed in, a message will be displayed

The app utilizes ssr in rehyrdrating the page for any city data displayed.
However, because I did not include a back end with this project, I used sessionStorage, in a custom hook, to store an
array of previously searched citys. When the page is refresed, on the client side, this data is fetched and then sent
to a thunk which will repopulate the store with previously searched citys and then render the collection of buttons.

Take a look, have fun and enjoy the colour show. You'll see what I mean :)

Terry Slack
