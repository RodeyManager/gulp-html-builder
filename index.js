/**
 * Created by Rodey on 2015/11/6.
 *
 * 合并html中的link和script标签
 * 生成文件名中添加 {{ _hash }}  将会在文件名中带上hash值
 * exp1:
 *      <!-- builder: app.min.css -->
 *      <link rel="stylesheet" href="example/assets/css/a.css"/>
 *      <link rel="stylesheet" href="example/assets/css/b.css" ignore/>
 *      <!-- builder end -->
 *
 *      <!-- builder: mian{{ _hash }}.js -->
 *      <script src="example/assets/js/a.js"></script>
 *      <script src="example/assets/js/b.js"></script>
 *      <script src="example/assets/js/c.js"></script>
 *      <!-- builder end -->
 *
 */

var fs          = require('fs'),
    path        = require('path'),
    through     = require('through2'),
    jsmin       = require('jsmin2'),
    uglifycss   = require('uglifycss'),
    PluginError = require('gulp-util').PluginError,
    Tool        = require('./lib/tools');

//插件名称
var PLUGIN_NAME = 'gulp-html-builder';

/**
 * 定义匹配正则
 * @type {RegExp}
 */
var buildRegx   = new RegExp('<!--\\s*builder:\\s*([\\s\\S]*?)\\s*-->([\\s\\S]*?)<!--\\s*builder\\s+end\\s*-->', 'gi'),
    linkRegx    = new RegExp('<link\\s+[\\s\\S]*?>[\\s\\S]*?<*\\/*>*', 'gi'),
    scriptRegx  = new RegExp('<script\\s+[\\s\\S]*?>[\\s\\S]*?<\\/script>', 'gi'),
    hrefRegx    = new RegExp('\\s*(href)="+([\\s\\S]*?)"'),
    srcRegx     = new RegExp('\\s*(src)="+([\\s\\S]*?)"');

/**
 * 编译匹配的链接地址
 * 并合并成新文件
 * @param text      页面中每一个builder之间的内容
 * @param file      传递的文件流
 * @param options   压缩控制选项
 * @returns {*}
 */
function callBuildReplace(text, file, options){

    var ms              = buildRegx.exec(text);
    buildRegx.lastIndex = 0;

    //获取指定build后的文件名称
    var buildedFile     = Tool.trim(ms[1]),
        parentFile      = path.normalize(file.path),
    //获取需要编译的文件列表
        fileList        = [],
    //获取编译文件类型
        type            = Tool.getExtname(buildedFile),
    //合并后的内容
        content         = '';

    //写入文件的路径
    var baseDir         = options.baseDir || 'dist/assets/',
        jsDir           = options.jsDir || 'js',
        cssDir          = options.cssDir || 'css';

    if('css' === type){
        fileList        = getFileList(Tool.trim(ms[2]), linkRegx, hrefRegx);
    }
    else if('js' === type){
        fileList        = getFileList(Tool.trim(ms[2]), scriptRegx, srcRegx);
    }

    //将读取的内容进行压缩
    if('css' === type){
        content         = uglifycss.processFiles(fileList.map(function(item){
            var p       = path.normalize(path.dirname(file.path) + path.sep + item);
            return p;
        }), options);
    }
    else if('js' === type){
        fileList.forEach(function(item, index){
            var p       = path.normalize(path.dirname(file.path) + path.sep + item);
            content     += Tool.getFileContent(p);
        });
        content         = jsmin(content, options).code;
    }

    //文件hash值
    var hashRegx = /([\s\S]+?)\{\{\s*([\s\S]*?)[@|$]*hash\s*\}\}(.[\s\S]+?)$/gi;
    if(hashRegx.test(buildedFile)){
        var hash = Tool.getFileHash(content);
        hashRegx.lastIndex = 0;
        var bs = hashRegx.exec(buildedFile);
        buildedFile = bs[1] + bs[2] + hash + bs[3];
        //console.log(bs, buildedFile, hash);
    }

    //导出文件路径
    var dir             = 'css' === type ? cssDir : 'js' === type ? jsDir : baseDir,
        execteDir       = Tool.restructPath(baseDir, dir) + '/',
        execteFile      = execteDir + buildedFile;
    //console.log(execteFile);

    //将内容写出到文件
    var isWrite         = Tool.writeFile(execteFile, content);
    if(isWrite)
        return execteFile;
    return null;

}

/**
 * 获取需要合并的文件列表
 * @param text          单行标签内容
 * @param regx          匹配单行标签正则
 * @param sourceRegx    匹配链接地址正则
 * @returns {Array}
 */
function getFileList(text, regx, sourceRegx){

    var files = [];
    text.replace(regx, function($1){
        var ms = sourceRegx.exec($1);
        var href = ms[2];
        files.push(href);
    });
    return files;
}


/**
 * 获取编译后的文件内容
 * @param file      文件流
 * @param options   控制选项
 * @returns {string}
 */
var getContent = function(file, options){

    var options = options || {},
        filterPath      = options.filterPath || '';

    var fileContents = file.contents.toString('utf8');
    var content = fileContents.replace(buildRegx, function($1){

        $1 = Tool.trim($1);
        var ms = buildRegx.exec($1);
        buildRegx.lastIndex = 0;
        var buildedFile = Tool.trim(ms[1]);
        var fileLink = callBuildReplace($1, file, options),
            type = Tool.getExtname(buildedFile);
        fileLink = fileLink.replace(filterPath, '');

        return Tool.inserTag(type, fileLink, options.attrs);

    });
    return content;
};

//主体函数
var htmlBuilder = function(options){

    return through.obj(function(file, enc, next){

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Stream content is not supported'));
            return next(null, file);
        }
        if (file.isBuffer()) {
            try {
                var content = getContent(file, options);
                file.contents = new Buffer(content);
            }
            catch (err) {
                this.emit('error', new PluginError(PLUGIN_NAME, ''));
            }
        }
        this.push(file);
        return next();


    });


};

module.exports = htmlBuilder;