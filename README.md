# Google Maps Traffic Notifier
Node.js service that allows to send information about traffic on Google Maps.

## How to?
1. Install node.js dependencies using:
<code>npm install</code>

2. Create config-my.json file using config.json.
Example config.json:
```
{
    "mail": {
        "server": "example.com",
        "port": 465,
        "secure": true,
        "username": "username",
        "password": "password",
        "name": "Google Maps Notifier",
        "address": "mail-notifier@example.com",
        "mailto": "example@example.com"
    },
    "image": {
        "extension": "jpg",
        "width": 800,
        "height": 600,
        "name": "map"
    },
    "map": {
        "latitude": 52.3082316,
        "longitude": 17.0398412
    },
    "API": {
        "key": "test"
    }
}
```

3. Run following command to generate and send map as an image via email: <code>npm run start</code>

## config.json
```
"API": {
    "key": "test"
}
```
Google Maps Javascript API key

### Author
pawelpwozny@gmail.com

### License
MIT