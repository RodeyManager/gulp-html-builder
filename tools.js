/**
 * Created by Rodey on 2015/11/6.
 */

var fs      = require('fs'),
    path    = require('path'),
    mkdirp  = require('mkdirp');

var Tools = function(){};

Tools.prototype = {
    //��ȡ�ļ�����
    getFileContent: function(file){
        if(!fs.existsSync(file)) throw new Error('Cannot fond file: ' + file);
        return fs.readFileSync(file, 'utf8');
    },

    //����ָ������������ƥ�������
    matchs: function(str, regx){
        var ms = str.match(regx);
        return ms;
    },

    //���ַ���תΪjson
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

    //ȥ����λ�հ�
    trim: function(text){
        return text.replace(/\n*\r*\t*/gi, '').replace(/^\s*|\s*$/i, '');
    },

    //д���ļ�
    writeFile: function(file, text, callback){
        var filePath = path.dirname(file);
        if(!fs.existsSync(filePath)){
            mkdirp.sync(filePath);
        }
        fs.writeFileSync(file, text, 'utf8');
        return fs.existsSync(file);
    },

    //�滻��ǩ
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

    //�ع�·��
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

    //��ȡ�ļ�������
    getExtname: function(file){
        return path.extname(file).replace(/\./gi, '');
    }

};


module.exports = new Tools();