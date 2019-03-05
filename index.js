#!/usr/bin/env node
 
const program = require('commander');
const fs=require('fs');
const beautify = require('js-beautify').js_beautify;
const _ = require('lodash');
const colors = require('colors');
const logSymbols = require('log-symbols');

 
const createFile = require('./createFile.js')


 

program
   .command('g <type> <name>    ')
   .option('-a1, --A1', 'Project Deleve Type: A1')
   .option('-a2, --A2', 'Project Deleve Type: A2')
   .option('-a3, --A3', 'Project Deleve Type: A3')
   .option('-b1, --B1', 'Project Deleve Type: B1')
   .option('-b2, --B2', 'Project Deleve Type: B2')
   .option('-b3, --B3', 'Project Deleve Type: B3')
   .description('generate page (p)/component(c) ')
   .action(function(type, name, devType) {

 

      let projectDevType = '';

      if(devType.A1){
        projectDevType = 'A1';
      }else if(devType.A2){
        projectDevType = 'A2';
      }else if(devType.A3){
        projectDevType = 'A3';
      }else if(devType.B1){
        projectDevType = 'B1';
      }else if(devType.B2){
        projectDevType = 'B2';
      }else if(devType.B3){
        projectDevType = 'B3';
      }else{
        projectDevType = '';
      } 


      if(projectDevType !== ''){
        console.log(`*** Project Develop Templete Type :${projectDevType} ***`)
      }



      switch(projectDevType)
      {
      case '':
        //generate module item
        if(type == "p"){
          console.log('===== generate page: "%s" =====', name);
          createFile.genPage(name);
        }
        break;
      case 'A1':
        console.log('A1')
        break;
      case 'A2':
        console.log('A2');
        createFile.genA2Page(name);
        break;
      case 'A3':
        console.log('A3')
        break;
      case 'B1':
        console.log('B1')
        break;
      case 'B2':
        console.log('B2')
        break;
     case 'B3':
        console.log('B3')
        break;           
      default:
       console.log('default')
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





 
 
 
