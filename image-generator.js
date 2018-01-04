const page = require('webpage').create(),
timeBegin = new Date().getTime(),
system = require('system');
args = system.args,
filename = args[1];

page.viewportSize = { width: 768, height: 1024 };

function finish(){
    const window = page.evaluate(function(){
        return window;
    });
    
    const timeEnd = new Date().getTime();

    if(window.imageGenerated){
        page.render('./' + filename + '.jpg');
        console.log('map loaded in:' + (timeEnd - timeBegin) + 'ms');
        phantom.exit();
    } else {
        console.log('waiting for map to be loaded; elapsed time:' + (timeEnd - timeBegin) + 'ms');
        setTimeout(finish, 250);
    }
}

page.open('./map-raw.html', function(){
    finish();
});