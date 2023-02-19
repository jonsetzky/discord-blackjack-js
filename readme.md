## Running the bot

Create a file containing the [application tokens](https://discord.com/developers/applications) using following environment variables

```
APPLICATION_ID=<application-id>
PUBLIC_KEY=<public-key>
PRIVATE_KEY=<private-key>
```

Create the docker image 

`docker build . -t discord-blackjack-js`

Run the image

`docker run --env-file ./.env -d discord-blackjack-js`