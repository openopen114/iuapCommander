#!/usr/bin/env node
 
const program = require('commander');
const fs=require('fs');
const beautify = require('js-beautify').js_beautify;
const _ = require('lodash');

 
const createFile = require('./createFile.js')


 

program
   .command('g <type> <name>')
   .description('generate module item (m)/component(c) ')
   .action(function(type, name) {
      
      //generate module item
      if(type == "m"){
        console.log('generate module item: "%s"', name);
        createFile.moduleItem(name);
      }

      //generate component
      if(type == "c"){
        console.log('generate component: "%s"', name);
        createFile.component(name)
      }
   });  

   
 
program
  .version('0.0.1')
  .usage('[options]') 
  .parse(process.argv);





 
 
 
