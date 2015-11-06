/**
 * Created by Rodey on 2015/11/6.
 *
 * �ϲ�html�е�link��script��ǩ
 * exp1:
 *      <!-- builder: app.min.css -->
 *      <link rel="stylesheet" href="example/assets/css/a.css"/>
 *      <link rel="stylesheet" href="example/assets/css/b.css" ignore/>
 *      <!-- builder end -->
 *
 *      <!-- builder: mian.js -->
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
    Tool        = require('./tools');

//�������
var PLUGIN_NAME = 'gulp-html-builder';

/**
 * ����ƥ������
  * @type {RegExp}
 */
var buildRegx   = new RegExp('<!--\\s*builder:\\s*([\\s\\S]*?)\\s*-->([\\s\\S]*?)<!--\\s*builder\\s+end\\s*-->', 'gi'),
    linkRegx    = new RegExp('<link\\s+[\\s\\S]*?>[\\s\\S]*?<*\\/*>*', 'gi'),
    scriptRegx  = new RegExp('<script\\s+[\\s\\S]*?>[\\s\\S]*?<\\/script>', 'gi'),
    hrefRegx    = new RegExp('\\s*(href)="+([\\s\\S]*?)"'),
    srcRegx     = new RegExp('\\s*(src)="+([\\s\\S]*?)"');

/**
 * ����ƥ������ӵ�ַ
 * ���ϲ������ļ�
 * @param text      ҳ����ÿһ��builder֮�������
 * @param file      ���ݵ��ļ���
 * @param options   ѹ������ѡ��
 * @returns {*}
 */
function callBuildReplace(text, file, options){

    var ms              = buildRegx.exec(text);
    buildRegx.lastIndex = 0;

    //��ȡָ��build����ļ�����
    var buildedFile     = Tool.trim(ms[1]),
        parentFile      = path.normalize(file.path),
    //��ȡ��Ҫ������ļ��б�
        fileList        = [],
    //��ȡ�����ļ�����
        type            = Tool.getExtname(buildedFile),
    //�ϲ��������
        content         = '';

    //д���ļ���·��
    var baseDir         = options.baseDir || 'dist/assets/',
        jsDir           = options.jsDir || 'js',
        cssDir          = options.cssDir || 'css';
    //�����ļ�·��
    var dir             = 'css' === type ? cssDir : 'js' === type ? jsDir : baseDir;
    var execteFile      = Tool.restructPath(baseDir, dir) + '/' + buildedFile;
    //console.log(execteFile);

    if('css' === type){
        fileList        = getFileList(Tool.trim(ms[2]), linkRegx, hrefRegx);
    }
    else if('js' === type){
        fileList        = getFileList(Tool.trim(ms[2]), scriptRegx, srcRegx);
    }
    //console.log(fileList);

    //����ȡ�����ݽ���ѹ��
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
    //console.log(content);

    //������д�����ļ�
    var isWrite         = Tool.writeFile(execteFile, content);
    if(isWrite)
        return execteFile;
    return null;

}

/**
 * ��ȡ��Ҫ�ϲ����ļ��б�
 * @param text          ���б�ǩ����
 * @param regx          ƥ�䵥�б�ǩ����
 * @param sourceRegx    ƥ�����ӵ�ַ����
 * @returns {Array}
 */
function getFileList(text, regx, sourceRegx){
    //var ts = text.match(linkRegx);
    var files = [];
    text.replace(regx, function($1){
        var ms = sourceRegx.exec($1);
        var href = ms[2];
        files.push(href);
    });
    return files;
}


/**
 * ��ȡ�������ļ�����
 * @param file      �ļ���
 * @param options   ����ѡ��
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

        return Tool.inserTag(type, fileLink);

    });
    return content;
};

//���庯��
var htmlBuilder = function(options){

    return through.obj(function(file, enc, next){

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Stream content is not supported'));
            return next(null, file);
        }
        if (file.isBuffer()) {
            try {
                var content = getContent(file, options);
                //console.log(content);
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