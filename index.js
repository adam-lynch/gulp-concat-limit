var through = require('through');
var os = require('os');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;

module.exports = function(fileName, lengthLimit, options){
    var pluginName = 'gulp-concat-limit';

    lengthLimit = lengthLimit || 25600;
    options = options || {};

    var buffer = [],
        resultFileBuffers = [],
        firstFile = null,
        currentResultFileLength = 0,
        fileSeparator = options.newLine && gutil.linefeed || '';

    function endFile(){
        resultFileBuffers.push(buffer);
        buffer = [];
        currentResultFileLength = 0;
    }

    function bufferContents(file){
        if (file.isNull()) return; // ignore
        if (file.isStream()) return this.emit('error', new PluginError(pluginName,  'Streaming not supported'));
        if (!fileName) return this.emit('error', new PluginError(pluginName,  'fileName parameter is required. None given.'));

        if (!firstFile) firstFile = file;

        var fileContents = file.contents.toString('utf8'),
            fileLength = fileContents.length;

        if(!fileLength) return;

        if(buffer.length && currentResultFileLength + fileLength > lengthLimit){
            endFile();
        }

        buffer.push(fileContents);
        currentResultFileLength += fileLength;
    }

    function endStream(){
        if (buffer.length > 0){
            resultFileBuffers.push(buffer);
        }

        if(resultFileBuffers.length === 0) this.emit('end');

        resultFileBuffers.map(function(resultFileBuffer, index){
            var extension = path.extname(fileName),
                fileBasename = path.basename(fileName, extension);

            this.push(new File({
                cwd: firstFile.cwd,
                base: firstFile.base,
                path: path.join(firstFile.base, fileBasename + index + extension),
                contents: new Buffer(resultFileBuffer.join(fileSeparator))
            }));

        }.bind(this));
        this.emit('end');
    }

    return through(bufferContents, endStream);
};