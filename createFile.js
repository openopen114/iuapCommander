const program = require('commander');
const fs=require('fs');
const beautify = require('js-beautify').js_beautify;
const _ = require('lodash');

module.exports.moduleItem = (_moduleItemName) => {
 
	const moduleItemName = _moduleItemName;
	const className = _.upperFirst(_.camelCase(moduleItemName));
	const modelName = `${className}Model`;
	const jsFileName = `${moduleItemName}.jsx`;
	const lessFileName = `${moduleItemName}.less`;

	const dir = `./${moduleItemName}`;
	const compDir = `${dir}/components`;



	// mkdir module folder
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}


	// mkdir module component folder
	if (!fs.existsSync(compDir)){
	    fs.mkdirSync(compDir);
	}






	// create container.js
	const containerJSContent = `import React from 'react';
								import mirror, { connect } from 'mirrorx'; 
								import ${className} from './components/${className}';
								import model from './model'

								if (!(model.name in mirror.actions)) { mirror.model(model); };

								export const Connected${className} = connect(state => state.${modelName}, null)(${className});
								`;

	 

	fs.writeFile(`${dir}/container.js`, beautify(containerJSContent, {brace_style: 'collapse-preserve-inline'}), err => {
		if(err) throw err;
		console.log(`${dir}/container.js create success `);
	})




	// create model.js
	const modelJSContent = `

							import { actions } from "mirrorx";
							import * as api from "./service";

							export default {
								name: "${modelName}",
								initialState: { 
								},
								reducers: {
									updateState(state, data) {
										return {
											...state,
											...data
										};
									}
								},
								effects: { 
								}
							};

							`;


	fs.writeFile(`${dir}/model.js`, beautify(modelJSContent, {brace_style: 'collapse-preserve-inline'}), err => {
		if(err) throw err;
		console.log(`${dir}/model.js create success `);
	})




	//service.js
	const serviceJSContent = `
								import axios from 'axios';
								import request from "utils/request";
								import { paramToUrl } from "utils";

								const APIURL = 'XXXXX';


								const URL = {
								    "XXXXX": '/XXXXX'
								}
								 
								 
								export const getList = (_username) => { 
									const queryURL = 'XXXXX';
								    return request(queryURL, {
								        method: "get"
								    });
								}							
	`;



	fs.writeFile(`${dir}/service.js`, beautify(serviceJSContent, {brace_style: 'collapse-preserve-inline'}), err => {
		if(err) throw err;
		console.log(`${dir}/service.js create success `);
	})




	// create jsx file
	let jsxContent = ` 
					import React, { PureComponent } from "react";
					import ReactDOM from 'react-dom';
					import { actions } from "mirrorx";
					 
					import './${lessFileName}';

					class ${className} extends  PureComponent {

						constructor(props) {
					        super(props);
					        this.state = {  
					        }
					    }
					 

						render() {  

							return ( 
							)
						}

					}


					export default ${className};

	`;

	 

	fs.writeFile(`${compDir}/${jsFileName}`, beautify(jsxContent, {brace_style: 'collapse-preserve-inline'}), err => {
		if(err) throw err;
		console.log(`${compDir}/${jsFileName} create success `);
	})


	// create lesss file
	fs.writeFile(`${compDir}/${lessFileName}`, '', err => {
		if(err) throw err;
		console.log(`${compDir}/${lessFileName} create success `);
	})

 

}





module.exports.component = (_compName) => {
	const className = _.upperFirst(_.camelCase(_compName));
	const jsFileName = `${_compName}.jsx`;
	const lessFileName = `${_compName}.less`;
	const compDir = `./components/${_compName}`;
 
	// mkdir module component folder
	if (!fs.existsSync(compDir)){
	    fs.mkdirSync(compDir);
	}


	// create jsx file
	let jsxContent = ` 
					import React, { PureComponent } from "react";
					import ReactDOM from 'react-dom';
					import { actions } from "mirrorx";
					 
					import './${lessFileName}';

					class ${className} extends  PureComponent {

						constructor(props) {
					        super(props);
					        this.state = {  
					        }
					    }
					 

						render() {  

							return ( 
							)
						}

					}


					export default ${className};

	`;

	 

	fs.writeFile(`${compDir}/${jsFileName}`, beautify(jsxContent, {brace_style: 'collapse-preserve-inline'}), err => {
		if(err) throw err;
		console.log(`${compDir}/${jsFileName} create success `);
	})


	// create lesss file
	fs.writeFile(`${compDir}/${lessFileName}`, '', err => {
		if(err) throw err;
		console.log(`${compDir}/${lessFileName} create success `);
	})




}