const program = require('commander');
const fs=require('fs');
const beautify = require('js-beautify-ejsx').js_beautify;
const html_beautify = require('js-beautify-ejsx').html_beautify;
const _ = require('lodash');
const colors = require('colors');
const logSymbols = require('log-symbols');
const prettier = require("prettier");

module.exports.genPage = (_pageName) => {
 
	const pageName = _pageName;
	const className = _.upperFirst(_.camelCase(pageName));
	const ComponentName = _.upperFirst(_.camelCase(pageName));
	const modelName = _.camelCase(pageName);
	const appFileName = `app.js`;
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
	const containerJSContent = 
	`

	import React from 'react';
	import mirror, {connect} from 'mirrorx'; 
	import ${className} from './components/${className}'; 
	import model from './model'

	mirror.model(model); 
	export const Connected${className}= connect(state => state.${modelName},null)(${className});

	`;

	 

	fs.writeFile(`${dir}/container.js`, prettier.format(containerJSContent), err => {
		if(err) throw err;
		console.log(logSymbols.success, `${dir}/container.js create success `.green);
	})





	/**********************************/
	/******** create model.js *********/
	/**********************************/
 
	const modelJSContent = ` 



	import {actions} from "mirrorx"; 
	import * as api from "./service";

	import { processData } from 'utils';

	export default { 
	    name: "${modelName}", 
	    initialState: { 
	    },
	    reducers: {
	        /**
	         * @param {*} state
	         * @param {*} data
	         */
	        updateState(state, data) { //更新state
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


	fs.writeFile(`${dir}/model.js`, prettier.format(modelJSContent), err => {
		if(err) throw err;
		console.log(logSymbols.success, `${dir}/model.js create success `.green);
	})


 
	/************************************/
	/******** create service.js *********/
	/************************************/
	const serviceJSContent = `
								 

		import request from "utils/request"; 
		const URL = {
		 "GET_DATA": \`\${GROBAL_HTTP_CTX}/\`

		}
		/*
		export const getData = (params) => {
		 return request(URL.GET_DATA, {
		 method: "get",
		 param: params
		 });
		}
		*/
												
	`;



	fs.writeFile(`${dir}/service.js`, prettier.format(serviceJSContent), err => {
		if(err) throw err;
		console.log(logSymbols.success, `${dir}/service.js create success `.green);
	})





	/*********************************/
	/******** create app.jsx *********/
	/*********************************/

	const appContent = `
			
		import React from "react";
		import mirror, { render,Router } from "mirrorx";
		import logger from "redux-logger";

		import Routes from './routes'

		import 'core-js/es6/map';
		import 'core-js/es6/set';

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


	fs.writeFile(`${dir}/${appFileName}`, prettier.format(appContent), err => {
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
		  <title>${className}</title>
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

		import React from "react";
		import {Route} from "mirrorx";
		import {Connected${className}} from "../container";

		export default () => (
		    <div className="route-content">
		        <Route exact path="/" component={Connected${className}}/>
		    </div>

		)
	`;



	fs.writeFile(`${routesDir}/index.js`, prettier.format(routesContent), err => {
		if(err) throw err;
		console.log(logSymbols.success, `${routesDir}/index.js  create success `.green);
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

	import React, {Component} from 'react';
	import {actions} from 'mirrorx';
	import {Button} from 'tinper-bee';

	import './${lessFileName}';

	class ${className} extends Component {
	    constructor(props) {
	        super(props);
	        this.state = {

	        }
	    }

	    componentDidMount() {
	        
	    }

	    render() {

	        return (
	            <div >
	               ${className} Works!
	            </div>
	        )
	    }
	}

	export default ${className};

 

	`;



	 

	fs.writeFile(`${compDir}/${jsFileName}`, prettier.format(jsxContent), err => {
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