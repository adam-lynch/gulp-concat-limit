var combineCSS = require('../');
var should = require('should');
var os = require('os');
var fs = require('fs');
var path = require('path');
var File = require('vinyl');
var Buffer = require('buffer').Buffer;
require('mocha');

describe('gulp-combine-css', function() {
    describe('combineCSS()', function() {
        var testDirectory = './test',
            testCSS = testDirectory + '/css',
            expectedCSS = testDirectory + '/expectedCSS';

        it('should combine files under the size and selector limits', function(done) {
            var stream = combineCSS({
                    lengthLimit: 99999999999,
                    prefix: 'test1-',
                    selectorLimit: 99999999999
                });

            fs.readFile(testCSS + '/a.css', 'utf8', function(err, data){
                if (err) {
                    throw new Error(err);
                }

                var stylesheetA = new File({
                    path: testCSS + '/a.css',
                    contents: new Buffer(data)
                });

                fs.readFile(testCSS + '/b.css', 'utf8', function(err, data){
                    if (err) {
                        throw new Error(err);
                    }

                    var stylesheetB = new File({
                        path: testCSS + '/b.css',
                        contents: new Buffer(data)
                    });

                    fs.readFile(testCSS + '/c.css', 'utf8', function(err, data){
                        if (err) {
                            throw new Error(err);
                        }

                        var stylesheetC = new File({
                            path: testCSS + '/c.css',
                            contents: new Buffer(data)
                        });

                        fs.readFile(expectedCSS + '/abc-0.css', 'utf8', function(err, expectedCSSContents){
                            if (err) {
                                throw new Error(err);
                            }

                            stream.on('data', function(newFile){
                                should.exist(newFile);
                                should.exist(newFile.path);
                                should.exist(newFile.relative);
                                should.exist(newFile.contents);

                                newFile.relative.should.equal("test1-0.css");
                                String(newFile.contents).should.equal(expectedCSSContents);
                                Buffer.isBuffer(newFile.contents).should.equal(true);
                                done();
                            });

                            stream.write(stylesheetA);
                            stream.write(stylesheetB);
                            stream.write(stylesheetC);
                            stream.end();
                        });
                    });
                });
            });
        });

        it('should not combine files if the combination would exceed the size limit', function(done) {
            var prefix = 'tooLarge-',
                stream = combineCSS({
                    lengthLimit: 200,
                    prefix: prefix,
                    selectorLimit: 99999999999
                });

            fs.readFile(testCSS + '/a.css', 'utf8', function(err, data){
                if (err) {
                    throw new Error(err);
                }

                var stylesheetA = new File({
                    path: testCSS + '/a.css',
                    contents: new Buffer(data)
                });

                fs.readFile(testCSS + '/b.css', 'utf8', function(err, data){
                    if (err) {
                        throw new Error(err);
                    }

                    var stylesheetB = new File({
                        path: testCSS + '/b.css',
                        contents: new Buffer(data)
                    });

                    fs.readFile(testCSS + '/c.css', 'utf8', function(err, data){
                        if (err) {
                            throw new Error(err);
                        }

                        var stylesheetC = new File({
                            path: testCSS + '/c.css',
                            contents: new Buffer(data)
                        });

                        fs.readFile(expectedCSS + '/' + prefix + '0.css', 'utf8', function(err, data){
                            if (err) {
                                throw new Error(err);
                            }

                            var expectedCSSContents = [data];

                            fs.readFile(expectedCSS + '/' + prefix + '1.css', 'utf8', function(err, data){
                                if (err) {
                                    throw new Error(err);
                                }

                                expectedCSSContents.push(data);
                                var iteration = 0;

                                stream.on('data', function(newFile){
                                    should.exist(newFile);
                                    should.exist(newFile.path);
                                    should.exist(newFile.relative);
                                    should.exist(newFile.contents);

                                    newFile.relative.should.equal(prefix + iteration + '.css');
                                    String(newFile.contents).should.equal(expectedCSSContents[iteration]);
                                    Buffer.isBuffer(newFile.contents).should.equal(true);

                                    iteration++;
                                    if(iteration === expectedCSSContents.length){
                                        done();
                                    }
                                });

                                stream.write(stylesheetA);
                                stream.write(stylesheetB);
                                stream.write(stylesheetC);
                                stream.end();
                            });
                        });
                    });
                });
            });
        });

        it('should not combine files if the combination would exceed the selector count limit', function(done) {
            var prefix = 'tooManySelectors-',
                stream = combineCSS({
                    lengthLimit: 99999999999,
                    prefix: prefix,
                    selectorLimit: 5
                });

            fs.readFile(testCSS + '/a.css', 'utf8', function(err, data){
                if (err) {
                    throw new Error(err);
                }

                var stylesheetA = new File({
                    path: testCSS + '/a.css',
                    contents: new Buffer(data)
                });

                fs.readFile(testCSS + '/b.css', 'utf8', function(err, data){
                    if (err) {
                        throw new Error(err);
                    }

                    var stylesheetB = new File({
                        path: testCSS + '/b.css',
                        contents: new Buffer(data)
                    });

                    fs.readFile(testCSS + '/c.css', 'utf8', function(err, data){
                        if (err) {
                            throw new Error(err);
                        }

                        var stylesheetC = new File({
                            path: testCSS + '/c.css',
                            contents: new Buffer(data)
                        });

                        fs.readFile(expectedCSS + '/' + prefix + '0.css', 'utf8', function(err, data){
                            if (err) {
                                throw new Error(err);
                            }

                            var expectedCSSContents = [data];

                            fs.readFile(expectedCSS + '/' + prefix + '1.css', 'utf8', function(err, data){
                                if (err) {
                                    throw new Error(err);
                                }

                                expectedCSSContents.push(data);
                                var iteration = 0;

                                stream.on('data', function(newFile){
                                    should.exist(newFile);
                                    should.exist(newFile.path);
                                    should.exist(newFile.relative);
                                    should.exist(newFile.contents);

                                    newFile.relative.should.equal(prefix + iteration + '.css');
                                    String(newFile.contents).should.equal(expectedCSSContents[iteration]);
                                    Buffer.isBuffer(newFile.contents).should.equal(true);

                                    iteration++;
                                    if(iteration === expectedCSSContents.length){
                                        done();
                                    }
                                });

                                stream.write(stylesheetA);
                                stream.write(stylesheetB);
                                stream.write(stylesheetC);
                                stream.end();
                            });
                        });
                    });
                });
            });
        });
    });
});