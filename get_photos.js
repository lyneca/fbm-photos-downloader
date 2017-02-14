var login = require('facebook-chat-api'),
  prompt = require('prompt'),
  parseArgs = require('minimist'),
  fs = require('fs'),
  request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream('photos/' + filename)).on('close', function(err) {
      callback(err, filename)
    });
  });
};

var image_number = 0;
var toDo = [];

var argv = parseArgs(process.argv.slice(2));

var schema = {
  properties: {
    email: {
      description: 'Facebook Email',
      required: true
    },
    password: {
      description: 'Facebook Password',
      hidden: true,
      required: true,
      replace: '*'
    },
  }
}
var old_start = ''
prompt.start();

prompt.get(schema, function (err, res) {
  login({email: res.email, password: res.password}, function(err, api) {
    function downloadPhotos(threadID) {
      api.getThreadHistory(threadID, 0, (argv.n ? argv.n : 10000), '', function(err,  his) {
          if (err) return console.error(err);
          if (!his || his[0].messageID == old_start) {
            return console.log('Got all URLs.');
          } else {
            old_start = his[0].messageID;
          }
          for (var i = 0; i < his.length; i++) {
            message = his[i];
            for (var j = 0; j < message.attachments.length; j++) {
              attachment = message.attachments[j]
              if (attachment.type == 'photo') {
                console.log('Got URL for photo #' + image_number + '.');
                toDo.push(image_number + '.png')
                download(attachment.previewUrl, image_number + '.png', function(err, filename) {
                  if (err) return console.error(err);
                  console.log('Downloaded photo ' + filename + '.')
                  toDo.splice(toDo.indexOf(filename), 1)
                  if (toDo.length == 0) {
                    console.log('Downloaded all images.')
                  }
                })
                image_number++;
              }
            }
          }
          // downloadPhotos(threadID, start + 500)
      })
    }
    if (argv.t) {
      downloadPhotos(argv.t, 0);
    } else if (argv.s) {
      api.getUserID(argv.s, function(err, data) {
        if (err) return console.error(err);
        downloadPhotos(data[0].userID, 0);
      });
    }
    if (err) return console.error(err);
  })
})
