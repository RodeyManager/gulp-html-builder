;(function(){'use strict';var SYST=function(){this.name='Rodey';this.age=28;};window.SYST=new SYST();}).call(this);window.onload=function(){console.log(SYST,'OK');};document.body.addEventListener('click',function(evt){var text=document.querySelector('#content').innerHTML;alert(text);},false);