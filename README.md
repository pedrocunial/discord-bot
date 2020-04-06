# gilbot.js

A discord bot

## Running

We are using `yarn` as our package manager and the default/expected commands
should be ready out of the box.

- installing

```shell script
yarn
```

- running

```shell script
yarn run start
```

### Additional dependencies

The program also uses `ffmpeg` (for video downloading and streaming) and
requires a
discord bot token.

By default, you can store your keys in either a `secrets/secrets.json` file
following the format:

```json
{
  "token": "<discord bot token string>"
}
```

Or by having it as environment variables (check `src/index.js`) file for
further documentation.

## Deploying

Currently I'm the bot is being deployed through heroku and the `Procfile`
already contains your required commands for that, however, for it's
complete functionality, you'll also need to add your keys as environment
variables in your heroku application dashboard as well as the `ffmpeg`
dependency in your heroku buildpacks (the URL for the `ffmpeg` buildpack
can be found in the `./buildpacks` file).

## Styling

The code uses the default airbnb eslint configuration with small tunings
(80 characters max line length because I like to use split screens). The
project itself is contains a prettier config file that most modern editors
can interpret and use with very convenient plugins.
