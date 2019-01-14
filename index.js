#!/usr/bin/env node
 
const program = require('commander');
const fs=require('fs');
const beautify = require('js-beautify').js_beautify;
const _ = require('lodash');
const colors = require('colors');
const logSymbols = require('log-symbols');

 
const createFile = require('./createFile.js')


 

program
   .command('g <type> <name>')
   .description('generate page (g)/component(c) ')
   .action(function(type, name) {
      
      //generate module item
      if(type == "p"){
        console.log('===== generate page: "%s" =====', name);
        createFile.genPage(name);
      }

      //generate component
      if(type == "c"){
        console.log('===== generate component: "%s" =====', name);
        createFile.genComponent(name)
      }
   });  

   
 
program
  .version('0.0.1')
  .usage('[options]') 
  .parse(process.argv);





 
 
 
