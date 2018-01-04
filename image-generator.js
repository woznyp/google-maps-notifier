const page = require('webpage').create(),
timeBegin = new Date().getTime(),
system = require('system');
args = system.args,
filename = args[1];

page.viewportSize = { width: 768, height: 1024 };
page.onConsoleMessage = function(msg) {
    if(msg === 'maploaded'){
        const timeEnd = new Date().getTime();

        page.render('./' + filename + '.jpg');
        console.log('map loaded in:' + (timeEnd - timeBegin) + 'ms');
        phantom.exit();
    }
};

page.open('./map-raw.html');