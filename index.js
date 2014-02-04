var through = require('through');
var gonzales = require('gonzales');
var os = require('os');
var path = require('path');
var File = require('vinyl');

module.exports = function(options){
    var pluginName = 'combine-css';

    options = options || {};

    var lengthLimit = options.lengthLimit || 999,
        selectorLimit = options.selectorLimit || 4,
        prefix = options.prefix || 'style-';

    var buffer = [],
        resultFileBuffers = [],
        firstFile = null,
        currentResultFileLength = 0,
        currentNumberOfSelectors = 0;

    function endFile(){
        resultFileBuffers.push(buffer);
        buffer = [];
        currentResultFileLength = 0;
        currentNumberOfSelectors = 0;
    }

    function bufferContents(file){
        if (file.isNull()) return; // ignore
        if (file.isStream()) return this.emit('error', new Error(pluginName,  'Streaming not supported'));

        if (!firstFile) firstFile = file;

        var fileContents = file.contents.toString('utf8'),
            fileLength = fileContents.length;

        if(!fileLength) return;

        if(buffer.length && currentResultFileLength + fileLength > lengthLimit){
            endFile();
        }


        //get selector count
        var selectorCount = gonzales.csspToTree(gonzales.srcToCSSP(fileContents)).match(/simpleselector/g).length;

        if(buffer.length && currentNumberOfSelectors + selectorCount > selectorLimit){
            endFile();
        }

        buffer.push(fileContents);
        currentResultFileLength += fileLength;
        currentNumberOfSelectors += selectorCount;
    }

    function endStream(){
        if (buffer.length > 0){
            resultFileBuffers.push(buffer);
        }

        if(resultFileBuffers.length === 0) this.emit('end');

        resultFileBuffers.map(function(resultFileBuffer, index){
            this.push(new File({
                cwd: firstFile.cwd,
                base: firstFile.base,
                path: path.join(firstFile.base, prefix + index + '.css'),
                contents: new Buffer(resultFileBuffer.join(''))
            }));

        }.bind(this));
        this.emit('end');
    }

    return through(bufferContents, endStream);
};