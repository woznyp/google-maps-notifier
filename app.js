(() => {
    const fs = require('fs'),
    path = require('path'),
    childProcess = require('child_process'),
    phantomjs = require('phantomjs-prebuilt'),
    nodemailer = require('nodemailer'),
    config = require('./config-my.json');

    class Mail{
        constructor(){
            this.server = config.mail.server;
            this.port = config.mail.port;
            this.secure = config.mail.secure;
            this.username = config.mail.username;
            this.password = config.mail.password;
            this.name = config.mail.name;
            this.address = config.mail.address;
            this.listOfAddresses = [config.mail.mailto];
            this.subject = `Traffic notification`;
            this.attachments = {
                image: config.image
            }
        }

        sendMail(){
            let transporter = nodemailer.createTransport({
                host: this.server,
                port: this.port,
                secure: this.secure,
                auth: {
                    user: this.username,
                    pass: this.password
                }
            }),
            imageName = `${this.attachments.image.name}.${this.attachments.image.extension}`,
            mailOptions = {
                from: `${this.name} <${this.address}>`,
                to: this.listOfAddresses.join(','),
                subject: this.subject,
                text: '',
                html: '<img src="cid:mapimage" title="google-maps-notifier">',
                attachments: [{
                    filename: imageName,
                    content: fs.createReadStream(path.join(__dirname, imageName)),
                    cid: 'mapimage'
                }]
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
        }
    }

    class GoogleMap{
        constructor(){
            this.latitude = config.map.latitude;
            this.longitude = config.map.longitude;
            this.API_KEY = config.API.key;
        }

        generateImageFile(){
            const binPath = phantomjs.path,
            childArgs = [
              '--ignore-ssl-errors=true',
              path.join(__dirname, 'image-generator.js'),
              config.image.name
            ];
             
            const child = childProcess.spawn(binPath, childArgs);

            child.stdout.on('data', (data) => {
                console.log('image-generator process', data.toString());
            });

            child.on('close', () => {
                const mail = new Mail();
                mail.sendMail();
            });
        }
    
        getStaticMap(){
            const API_URL = 'https://maps.googleapis.com/maps/api/staticmap?',
            LATITUDE = this.latitude,
            LONGITUDE  = this.longitude,
            STATIC_MAP_IMAGE_SRC = `${API_URL}?center=${LATITUDE},${LONGITUDE}&zoom=12&size=640x640&key=${this.API_KEY}`;
    
            return STATIC_MAP_IMAGE_SRC;
        }
    
        getMap(){
            const date = new Date();
            let day = date.getDate(),
                month = date.getMonth() + 1,
                year = date.getFullYear(),
                hour = date.getHours(),
                minutes = date.getMinutes();

                day = day < 10 ? '0' + day : day;
                month = month < 10 ? '0' + month : month;
                hour = hour < 10 ? '0' + hour : hour;
                minutes = minutes < 10 ? '0' + minutes : minutes;

            const OPTIONS = {
                API_URL: `https://maps.googleapis.com/maps/api/js?key=${this.API_KEY}&callback=initMap`,
                LATITUDE: this.latitude,
                LONGITUDE: this.longitude,
                DATE: `${day}/${month}/${year} ${hour}:${minutes}`
            };
    
            fs.readFile('./map.html.template', 'utf-8', (err, data) => {
                if(err){
                    console.log('Error occured during reading map.html file', err);
                }
    
                for(const key in OPTIONS){
                    if(OPTIONS.hasOwnProperty(key)){
                        data = data.replace(`@@${key}@@`, OPTIONS[key]);
                    }
                }
    
                fs.writeFile('./map-raw.html', data, this.generateImageFile);
            });
        }
    }

    const map = new GoogleMap();
    map.getMap();
})()
