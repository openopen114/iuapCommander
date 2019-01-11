const program = require('commander');
const fs=require('fs');
const beautify = require('js-beautify-ejsx').js_beautify;
const html_beautify = require('js-beautify-ejsx').html_beautify;
const _ = require('lodash');
const colors = require('colors');
const logSymbols = require('log-symbols');

module.exports.genPage = (_pageName) => {
 
	const pageName = _pageName;
	const className = _.upperFirst(_.camelCase(pageName));
	const ComponentName = _.upperFirst(_.camelCase(pageName));
	const modelName = _.camelCase(pageName);
	const appFileName = `app.jsx`;
	const jsFileName = `index.jsx`;
	const lessFileName = `index.less`;
	const indexHtmmFileName = `index.html`;

	const dir = `./${pageName}`;
	const compDir = `${dir}/components`;
	const routesDir = `${dir}/routes`;



	// mkdir module folder
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}


	// mkdir module component folder
	if (!fs.existsSync(compDir)){
	    fs.mkdirSync(compDir);
	}



	// mkdir module routes folder
	if (!fs.existsSync(routesDir)){
	    fs.mkdirSync(routesDir);
	}






	/**************************************/
	/******** create container.js *********/
	/**************************************/
	const containerJSContent = `import React from 'react';
								import mirror, { connect } from 'mirrorx'; 
								import ${className} from './components/${className}';
								import model from './model'

								if (!(model.name in mirror.actions)) { mirror.model(model); };

								export const Connected${className} = connect(state => state.${modelName}, null)(${className});
								`;

	 

	fs.writeFile(`${dir}/container.js`, beautify(containerJSContent, {brace_style: 'collapse-preserve-inline', e4x:'ture'}), err => {
		if(err) throw err;
		console.log(logSymbols.success, `${dir}/container.js create success `.green);
	})




	/**********************************/
	/******** create model.js *********/
	/**********************************/
 
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
		console.log(logSymbols.success, `${dir}/model.js create success `.green);
	})


 
	/************************************/
	/******** create service.js *********/
	/************************************/
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
		console.log(logSymbols.success, `${dir}/service.js create success `.green);
	})





	/*********************************/
	/******** create app.jsx *********/
	/*********************************/

	const appContent = `
			import React from "react";
			import 'core-js/es6/map';
			import 'core-js/es6/set';
			import logger from "redux-logger";
			import mirror, { render,Router } from "mirrorx";
			import Routes from './routes'
			import 'tinper-bee/assets/tinper-bee.css'
			import "src/app.less";


			const MiddlewareConfig = [];

			if(__MODE__ == "development") MiddlewareConfig.push(logger);

			mirror.defaults({
			    historyMode: "hash",
			    middlewares: MiddlewareConfig
			});



			

			render(<Router>
			    <Routes />
			</Router>, document.querySelector("#app"));

	`;


	fs.writeFile(`${dir}/${appFileName}`, beautify(appContent, {brace_style: 'collapse-preserve-inline', e4x:'ture'}), err => {
		if(err) throw err;
		console.log(logSymbols.success, `${dir}/${appFileName} create success `.green);
	})






	/************************************/
	/******** create index.html *********/
	/************************************/

	const indexHtmlContent =`

		<!DOCTYPE html>
		<html lang="zh-TW">

		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0"
		  />
		  <meta http-equiv="X-UA-Compatible" content="ie=edge">
		  <title>My Title</title>
		    <% for (var chunk in htmlWebpackPlugin.files.css) { %>
		    <link href="<%=htmlWebpackPlugin.files.css[chunk] %>" rel="stylesheet">
		    <% } %>
		</head>

		
		<body>
		  <div id="app">
		    <div class="u-loading-backdrop">
		      <div>
		        <div class="u-loading u-loading-line">
		          <div></div>
		          <div></div>
		          <div></div>
		          <div></div>
		          <div></div>
		        </div>
		      </div>
		    </div>
		  </div>
		  <% for (var chunk in htmlWebpackPlugin.files.chunks) { %>
		  <script type="text/javascript" src="<%=htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
		  <% } %>
		</body>
		</html>
	

	`;




	fs.writeFile(`${dir}/${indexHtmmFileName}`, html_beautify(indexHtmlContent), err => {
		if(err) throw err;
		console.log(logSymbols.success, `${dir}/${indexHtmmFileName} create success `.green);
	})




	/***********************************/
	/******** create component *********/
	/***********************************/

	this.genComponent(ComponentName, _pageName);




	/********************************/
	/******** create routes *********/
	/********************************/
	const routesContent = `

		import React, { Component } from "react";
		import { Route } from "mirrorx";
 
		import {Connected${className}} from "../container";

		export default ()=>{
		    return (
		        <div className="route-content">
		            <Route exact path={'/'} component={Connected${className}}/>
		        </div>
		    )
		}


	`;



	fs.writeFile(`${routesDir}/index.jsx`, beautify(routesContent, {brace_style: 'collapse-preserve-inline', e4x:'ture'}), err => {
		if(err) throw err;
		console.log(logSymbols.success, `${routesDir}/index.jsx  create success `.green);
	})


 

 


 
 

}





module.exports.genComponent = (_compName, pageName='') => {
	const className = _.upperFirst(_.camelCase(_compName)); 
	const jsFileName = `index.jsx`;
	const lessFileName = `index.less`;
	const compDir = pageName == '' ? `./components/${className}` : `./${pageName}/components/${className}`;

 
 
	// mkdir module component folder
	if (!fs.existsSync(compDir)){
	    fs.mkdirSync(compDir);
	}


	/***********************************/
	/******** create jsx file **********/
	/***********************************/
	let jsxContent = ` 
					import React, { PureComponent } from "react";
					import ReactDOM from 'react-dom';
					import { actions } from "mirrorx";

					import 'bee-complex-grid/build/Grid.css';
					import 'bee-pagination/build/Pagination.css' 
					 
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



					// export default connect( state => state.YOUR_MODEL_NAME, null )(${className});

 

	`;



	 

	fs.writeFile(`${compDir}/${jsFileName}`, beautify(jsxContent, {brace_style: 'collapse-preserve-inline', e4x:'ture'}), err => {
		if(err) throw err;
		console.log(logSymbols.success, `${compDir}/${jsFileName} create success `.green);
	})



	/************************************/
	/******** create less file **********/
	/************************************/


	// create less file
	fs.writeFile(`${compDir}/${lessFileName}`, '', err => {
		if(err) throw err;
		console.log(logSymbols.success, `${compDir}/${lessFileName} create success `.green);
	})




}