/**
 * Created by Rodey on 2015/11/6.
 */

var fs          = require('fs'),
    path        = require('path'),
    crypto      = require('crypto'),
    del         = require('del'),
    through     = require('through2'),
    jsmin       = require('jsmin2'),
    uglifycss   = require('uglifycss'),
    Tool        = require('./tools');

/*
 <!-- builder: app.min.css -->
 <link rel="stylesheet" href="assets/css/a.css"/>
 <link rel="stylesheet" href="assets/css/b.css" ignore/>
 <!-- builder end -->
 */

/*var buildRegx   = new RegExp('<!--\\s*builder:\\s*([\\s\\S]*?)\\s*-->([\\s\\S]*?)<!--\\s*builder\\s+end\\s*-->', 'gi'),
    linkRegx    = new RegExp('<link\\s+[\\s\\S]*?>[\\s\\S]*?<*\\/!*>*', 'gi'),
    scriptRegx  = new RegExp('<script\\s+[\\s\\S]*?>[\\s\\S]*?<\\/script>', 'gi'),
    hrefRegx    = new RegExp('\\s*(href)="+([\\s\\S]*?)"'),
    srcRegx     = new RegExp('\\s*(src)="+([\\s\\S]*?)"');


//var html = Tool.getFileContent('example/buildCss.html');
//var html = Tool.getFileContent('example/buildJs.html');
var html = Tool.getFileContent('example/src/buildJs.html');
var rlink = html.replace(buildRegx, function($1){

    $1 = Tool.trim($1);
    var ms = buildRegx.exec($1);
    buildRegx.lastIndex = 0;
    var buildedFile = Tool.trim(ms[1]);
    var fileLink = callBuildReplace($1),
        type = Tool.getExtname(buildedFile);
    return '';//Tool.inserTag(type, fileLink);

});
//console.log(rlink);


function callBuildReplace(text, callback){
    //console.log(buildRegx.exec(text));
    var ms = buildRegx.exec(text);
    buildRegx.lastIndex = 0;
    //console.log(ms);

    //获取指定build后的文件名称
    var buildedFile = Tool.trim(ms[1]);
    console.log(buildedFile);

    //获取需要编译的文件列表
    var fileList = [], type = Tool.getExtname(buildedFile);
    //console.log(type);
    if('css' === type){
        fileList = getFileList(Tool.trim(ms[2]), linkRegx, hrefRegx);
    }
    else if('js' === type){
        fileList = getFileList(Tool.trim(ms[2]), scriptRegx, srcRegx);
    }
    var content = '',
        file = path.resolve('dist/assets/'+ type +'/', buildedFile);
    //console.log(fileList);

    //将读取的内容进行压缩
    if('css' === type){
        content = uglifycss.processFiles(fileList, {});
    }
    else if('js' === type){
        fileList.forEach(function(file, index){
            content += Tool.getFileContent(file);
        });
        content = jsmin(content, {}).code;
    }
    var buf = new Buffer(content);
    var hash = crypto.createHash('md5').update(buf).digest('hex');

    var bs = /([\s\S]+?)\{\{\s*([\s\S]*?)hash\s*\}\}(.[\s\S]+?)$/gi.exec(buildedFile);
    buildedFile = bs[1] + bs[2] + hash + bs[3];
    console.log(bs, buildedFile, hash);

    //将内容写出到文件
    var isWrite = Tool.writeFile(file, content);
    if(isWrite)
        return file;
    return null;

}

function getFileList(text, regx, sourceRegx){
    //var ts = text.match(linkRegx);
    var files = [];
    text.replace(regx, function($1){
        var ms = sourceRegx.exec($1);
        var href = ms[2];
        files.push(href);
    });
    return files;
}*/

/*del(['./example/dist/assets/!**!/!*']).then(function(paths){
    console.log('delete ' + paths + ' success!');
});*/
