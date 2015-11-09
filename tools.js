/**
 * Created by Rodey on 2015/11/6.
 */

var fs      = require('fs'),
    path    = require('path'),
    mkdirp  = require('mkdirp');

var Tools = function(){};

Tools.prototype = {
    //获取文件内容
    getFileContent: function(file){
        if(!fs.existsSync(file)) throw new Error('Cannot fond file: ' + file);
        return fs.readFileSync(file, 'utf8');
    },

    //根据指定的正则搜索匹配的内容
    matchs: function(str, regx){
        var ms = str.match(regx);
        return ms;
    },

    //将字符串转为json
    toJSON: function(str){
        var data = str.replace(/\n*\t*\r*\s*/gi, '')
            .replace(/'|"/gi, '"')
            .replace(/:/gi, '":')
            .replace(/,/gi, ',"')
            .replace(/\{/gi, '{"')
            .replace(/""/gi, '"')
            .replace(/:",/gi, ':"",');
        try{
            return JSON.parse(data);
        }catch(e){
            throw new Error(e);
        }
    },

    //去除首位空白
    trim: function(text){
        return text.replace(/\n*\r*\t*/gi, '').replace(/^\s*|\s*$/i, '');
    },

    //写出文件
    writeFile: function(file, text, callback){
        var filePath = path.dirname(file);
        if(!fs.existsSync(filePath)){
            mkdirp.sync(filePath);
        }
        fs.writeFileSync(file, text, 'utf8');
        return fs.existsSync(file);
    },

    //替换标签
    inserTag: function(type, link, options){
        var attrs = this.parseData(options);
        if('css' === type)
            return '<link rel="stylesheet" type="text/css" href="' + link + '"' + attrs + '/>';
        else if('js' === type)
            return '<script type="text/javascript" src="' + link + '"' + attrs + '></script>';
        return '';
    },

    parseData: function(data){
        if(!data || 'object' !== typeof data || data === {}) return '';
        var s = ' ';
        for(var k in data){
            if(data[k])
                s += ' ' + k + '=' + data[k];
        }
        return s;
    },

    //重构路径
    restructPath: function(base, epath){

        //like:  base: 'dist/assets';  epath: 'dist/assets/js'
        if(epath && epath.indexOf(base) !== -1){
            return epath;
        }

        if(base && (!epath || '' === epath)){
            return base;
        }

        if((!base || '' === base) && (!epath || '' === epath)){
            return '';
        }

        return base.replace(/\/$/i, '/') + '/' + epath.replace(/^\//i, '');
    },

    //获取文件控制名
    getExtname: function(file){
        return path.extname(file).replace(/\./gi, '');
    }

};


module.exports = new Tools();