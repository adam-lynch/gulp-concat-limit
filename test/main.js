var concat = require('../');
var should = require('should');
var os = require('os');
var fs = require('fs');
var path = require('path');
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;
require('mocha');

describe('gulp-concat-limit', function() {
    describe('concat()', function() {
        var testDirectory = './test',
            assets = testDirectory + '/assets',
            expectedAssets = testDirectory + '/expectedAssets';

        it('should combine files under the length limit', function(done) {
            var stream = concat('testA.js', 99999999999);

            fs.readFile(assets + '/a.js', 'utf8', function(err, data){
                if (err) {
                    throw new Error(err);
                }

                var stylesheetA = new File({
                    path: assets + '/a.js',
                    contents: new Buffer(data)
                });

                fs.readFile(assets + '/b.js', 'utf8', function(err, data){
                    if (err) {
                        throw new Error(err);
                    }

                    var stylesheetB = new File({
                        path: assets + '/b.js',
                        contents: new Buffer(data)
                    });

                    fs.readFile(assets + '/c.js', 'utf8', function(err, data){
                        if (err) {
                            throw new Error(err);
                        }

                        var stylesheetC = new File({
                            path: assets + '/c.js',
                            contents: new Buffer(data)
                        });

                        fs.readFile(expectedAssets + '/abc0.js', 'utf8', function(err, expectedCSSContents){
                            if (err) {
                                throw new Error(err);
                            }

                            stream.on('data', function(newFile){
                                should.exist(newFile);
                                should.exist(newFile.path);
                                should.exist(newFile.relative);
                                should.exist(newFile.contents);

                                newFile.relative.should.equal("testA0.js");
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

        it('should not combine files if the combination would exceed the length limit', function(done) {
            var prefix = 'tooLarge',
                stream = concat(prefix + '.css', 200);

            fs.readFile(assets + '/a.css', 'utf8', function(err, data){
                if (err) {
                    throw new Error(err);
                }

                var stylesheetA = new File({
                    path: assets + '/a.css',
                    contents: new Buffer(data)
                });

                fs.readFile(assets + '/b.css', 'utf8', function(err, data){
                    if (err) {
                        throw new Error(err);
                    }

                    var stylesheetB = new File({
                        path: assets + '/b.css',
                        contents: new Buffer(data)
                    });

                    fs.readFile(assets + '/c.css', 'utf8', function(err, data){
                        if (err) {
                            throw new Error(err);
                        }

                        var stylesheetC = new File({
                            path: assets + '/c.css',
                            contents: new Buffer(data)
                        });

                        fs.readFile(expectedAssets + '/' + prefix + '0.css', 'utf8', function(err, data){
                            if (err) {
                                throw new Error(err);
                            }

                            var expectedCSSContents = [data];

                            fs.readFile(expectedAssets + '/' + prefix + '1.css', 'utf8', function(err, data){
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

        it('should interleave line breaks when told', function(done) {
            var stream = concat('abcLineBreaks.css', 99999999999, {
                newLine: true
            });

            fs.readFile(assets + '/a.css', 'utf8', function(err, data){
                if (err) {
                    throw new Error(err);
                }

                var stylesheetA = new File({
                    path: assets + '/a.css',
                    contents: new Buffer(data)
                });

                fs.readFile(assets + '/b.css', 'utf8', function(err, data){
                    if (err) {
                        throw new Error(err);
                    }

                    var stylesheetB = new File({
                        path: assets + '/b.css',
                        contents: new Buffer(data)
                    });

                    fs.readFile(assets + '/c.css', 'utf8', function(err, data){
                        if (err) {
                            throw new Error(err);
                        }

                        var stylesheetC = new File({
                            path: assets + '/c.css',
                            contents: new Buffer(data)
                        });

                        fs.readFile(expectedAssets + '/abcLineBreaks0.css', 'utf8', function(err, expectedCSSContents){
                            if (err) {
                                throw new Error(err);
                            }

                            stream.on('data', function(newFile){
                                should.exist(newFile);
                                should.exist(newFile.path);
                                should.exist(newFile.relative);
                                should.exist(newFile.contents);

                                newFile.relative.should.equal("abcLineBreaks0.css");
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
    });
});