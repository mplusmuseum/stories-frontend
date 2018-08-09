# mplusmuseum-stories

Front-end app for M+ Stories website. Single page application with server-side rendering.

## How this Fits

This repository contains the source code for the M+ Stories front-end web application.

### Prerequisites

You will need node and npm installed to run the app. Due to the use of server-side rendering, the app will not initialize without being properly configured to make requests from the M+ Stories API.

### Installation

Duplicate or rename the `.env.example` file to `.env`. Alternatively create a new file with the required variables. All the possible environment variables are listed below.

Install the project dependencies using the following command:
``` bash
npm install
```

##### Required Environment Variables

These values are **required** for the app to run.

|Variable|Description|Default Value|
|:---|---|---|
|API_URL|The base URL for the API|`https://cms.mplus.org.hk`|
|FONT_URL|The base URL for font file assets|`https://cms.mplus.org.hk/fonts`|

##### Optional Environment Variables

These values can be safely omitted.

|Variable|Description|Example Value|
|:---|---|---|
|MODE|Site Mode|`MAINTENANCE`|
|ANALYTICS_ID|Google Analytics ID|`UA-XXX-Y`|
|SITE_VERIFICATION|Google Site Verification Code|`abc123`|
|AUTH|To enable basic authentication|`TRUE`|
|PORT|The port the app will on|`8080`|
|USEHTTPS|Enable HTTPS redirects with Express|`TRUE`|
|SECUREPORT|HTTPS Port|`8443`|
|SSLKEY|Path for SSL Key file|`/key.pem`|
|SSLCERT|Path for SSL Certificate file|`/cert.pem`|
|SSLPASSPHRASE|SSL Passphrase|`password`

### Basic Authentication

To enable basic authentication for the front-end app, set the AUTH environment variable to true in your .env file, you will also need to add a .htpasswd file in the project root directory. Use the line format {user:pass} or {user:passHash} in the .htpasswd file.

## Using the Tools

Serve the app in development mode.
``` bash
npm run dev 
```

Run build processes for production.
``` bash
npm run build
```

Start the production application.
``` bash
npm start
```

In production, the use of [pm2](http://pm2.keymetrics.io/) to run the application is recommended.
``` bash
pm2 start npm --name "mplusmuseum-stories" -- start
```

## Built With

* [Vue](https://github.com/vuejs/vue)
* [Vuex](https://github.com/vuejs/vuex)

## Contributing

We welcome your contributions. If you have an addition or correction, please fork this repository, make your change, and submit a pull-request.

## Authors

Design and build by [Zak Group](https://www.zakgroup.co.uk/).

[Rupert Dunk](https://rupertdunk.com/), [Teo Furtado](https://teofurtado.com/), [Zak Kyes](https://www.zakgroup.co.uk/office/zak-kyes).

Credit to the official [Vue Hacker News Clone](https://github.com/vuejs/vue-hackernews-2.0/) for providing the original project structure and build processes.

## License

We are using the [MIT License](LICENSE).
