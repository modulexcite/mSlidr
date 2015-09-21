
 var fileSystem = require('fs'),
    path = require('path');


module.exports = function(req,res,next){

	if(req.url === '/'){
        
        sendfile(["app/index.html"], req,res); 
    }
		
    else if(req.url.indexOf('/slider') === 0) // url start with slider
    {
       
        sendfile(["app/mslider.html"], req,res); 
    }
    else next(); 
}

function sendfile(path,req,res){
	var filePath = path.join(__dirname, path);
    var stat = fileSystem.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
}