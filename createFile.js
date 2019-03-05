const program = require("commander");
const fs = require("fs");
const beautify = require("js-beautify-ejsx").js_beautify;
const html_beautify = require("js-beautify-ejsx").html_beautify;
const _ = require("lodash");
const colors = require("colors");
const logSymbols = require("log-symbols");
const prettier = require("prettier/standalone");
const plugins = [require("prettier/parser-babylon")];

module.exports.genPage = _pageName => {
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
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // mkdir module component folder
    if (!fs.existsSync(compDir)) {
        fs.mkdirSync(compDir);
    }

    // mkdir module routes folder
    if (!fs.existsSync(routesDir)) {
        fs.mkdirSync(routesDir);
    }

    /**************************************/
    /******** create container.js *********/
    /**************************************/
    const containerJSContent = `

	import React from 'react';
	import mirror, {connect} from 'mirrorx'; 
	import ${className} from './components/${className}'; 
	import model from './model'

	mirror.model(model); 
	export const Connected${className}= connect(state => state.${modelName},null)(${className});

	`;

    fs.writeFile(
        `${dir}/container.js`,
        prettier.format(containerJSContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${dir}/container.js create success `.green
            );
        }
    );

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

    fs.writeFile(
        `${dir}/model.js`,
        prettier.format(modelJSContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${dir}/model.js create success `.green
            );
        }
    );

    /************************************/
    /******** create service.js *********/
    /************************************/
    const serviceJSContent = `
								 

		import request from "utils/request"; 
		const URL = {
		 "GET_DATA": \`\$\{GROBAL_HTTP_CTX\}/\`

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

    fs.writeFile(
        `${dir}/service.js`,
        prettier.format(serviceJSContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${dir}/service.js create success `.green
            );
        }
    );

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

    fs.writeFile(
        `${dir}/${appFileName}`,
        prettier.format(appContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${dir}/${appFileName} create success `.green
            );
        }
    );

    /************************************/
    /******** create index.html *********/
    /************************************/

    const indexHtmlContent = `

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

    fs.writeFile(
        `${dir}/${indexHtmmFileName}`,
        html_beautify(indexHtmlContent),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${dir}/${indexHtmmFileName} create success `.green
            );
        }
    );

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

    fs.writeFile(
        `${routesDir}/index.js`,
        prettier.format(routesContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${routesDir}/index.js  create success `.green
            );
        }
    );
};








module.exports.genA2Page = _pageName => {
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
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // mkdir module component folder
    if (!fs.existsSync(compDir)) {
        fs.mkdirSync(compDir);
    }

    // mkdir module routes folder
    if (!fs.existsSync(routesDir)) {
        fs.mkdirSync(routesDir);
    }

    /**************************************/
    /******** create container.js *********/
    /**************************************/
    const containerJSContent = `

    import React from 'react';
    import mirror, {connect} from 'mirrorx'; 
    import ${className} from './components/${className}'; 
    import model from './model'

    mirror.model(model); 
    export const Connected${className}= connect(state => state.${modelName},null)(${className});

    `;

    fs.writeFile(
        `${dir}/container.js`,
        prettier.format(containerJSContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${dir}/container.js create success `.green
            );
        }
    );

    /**********************************/
    /******** create model.js *********/
    /**********************************/

    const modelJSContent = ` 

        /**
         * mirrorx定义modal
         */

        import { actions } from "mirrorx";
        // 引入services，如不需要接口请求可不写
        import * as api from "./service";
        // 接口返回数据公共处理方法，根据具体需要
        import { processData, success, Error } from "utils";


        export default {
            // 确定 Store 中的数据模型作用域
            name: "${modelName}",
            // 设置当前 Model 所需的初始化 state
            initialState: {
                cacheData: [],//新增、修改缓存原始数据
                tableData: [],//表格最终处理渲染的数据
                selectData: [],//选中的状态数组
                status: 'view',//表格状态：view=查看、edit=编辑、new=新增、del=删除
                rowEditStatus: true,//操作拖拽列、宽开关
                showLoading: false,
                list: [],
                totalPages: 1,
                total: 0,
                queryParam: {
                    pageParams: {
                        pageIndex: 0,
                        pageSize: 25
                    },
                    groupParams: [],
                    whereParams: []
                }
            },
            reducers: {
                /**
                 * 纯函数，相当于 Redux 中的 Reducer，只负责对数据的更新。
                 * @param {object} state
                 * @param {object} data
                 */
                updateState(state, data) { //更新state
                    return {
                        ...state,
                        ...data
                    };
                }
            },
            effects: {
                /**
                 * 加载列表数据
                 * @param {object} param
                 */
                async loadList(param) {
                    // 正在加载数据，显示加载 Loading 图标
                    actions.${modelName}.updateState({ showLoading: true });
                    // 调用 getList 请求数据
                    let res = processData(await api.getList(param));
                    actions.${modelName}.updateState({ showLoading: false });
                    if (res) {
                        const { content: list, number, totalPages, totalElements: total } = res;
                        const pageIndex = number + 1;
                        actions.${modelName}.updateState({
                            list,
                            pageIndex,
                            totalPages,
                            total,
                            queryParam: param,
                            cacheData: list
                        });
                    }
                },
                /**
                 * 批量添加数据
                 *
                 * @param {Array} [param=[]] 数组对象的数据
                 * @returns {bool} 操作是否成功
                 */
                async adds(param, getState) {
                    actions.${modelName}.updateState({ showLoading: true });
                    let { data } = await api.adds(param);
                    actions.${modelName}.updateState({ showLoading: false });
                    if (data.success == 'success') {
                        actions.${modelName}.loadList(getState().${modelName}.queryParam);
                        actions.${modelName}.updateState({ status: "view", rowEditStatus: true, selectData: [] });
                        return true;
                    } else {
                        return false;
                    }
                },
                /**
                 * 批量删除数据
                 *
                 * @param {Array} [param=[]]
                 */
                async removes(param, getState) {
                    actions.${modelName}.updateState({ showLoading: true });
                    let { data } = await api.removes(param);
                    actions.${modelName}.updateState({ showLoading: false, selectData: [] });
                    if (data.success == 'success') {
                        actions.${modelName}.loadList(getState().${modelName}.queryParam);
                        return true;
                    } else {
                        return false;
                    }
                },
                /**
                 * 批量删除数据
                 *
                 * @param {Array} [param=[]]
                 */
                async updates(param, getState) {
                    actions.${modelName}.updateState({ showLoading: true });
                    let { data } = await api.updates(param);
                    actions.${modelName}.updateState({ showLoading: false, selectData: [] });
                    if (data.success == 'success') {
                        actions.${modelName}.loadList(getState().${modelName}.queryParam);
                        actions.${modelName}.updateState({ status: "view", rowEditStatus: true, selectData: [] });
                        return true;
                    } else {
                        return false;
                    }
                },
                resetData(status, getState) {
                    let cacheData = getState().${modelName}.cacheData.slice();
                    cacheData.map(item => delete item.edit);
                    cacheData.map(item => delete item._edit);
                    if (status) {
                        actions.${modelName}.updateState({ list: cacheData, status: "view" });
                    } else {
                        actions.${modelName}.updateState({ list: cacheData });
                    }
                }
            }
        };


                            `;

    fs.writeFile(
        `${dir}/model.js`,
        prettier.format(modelJSContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${dir}/model.js create success `.green
            );
        }
    );

    /************************************/
    /******** create service.js *********/
    /************************************/
    //\\`\$\{GROBAL_HTTP_CTX\}
    const serviceJSContent = `
                                 

        /**
         * request服务请求类
         */

        import request from "utils/request";
        import axios from "axios";
        import { deepClone } from 'utils';

        //定义接口地址
        const URL = {
            "GET_LIST": \`\$\{GROBAL_HTTP_CTX\}/xxxxx_api/list\`,
            "GET_ADD": \`\$\{GROBAL_HTTP_CTX\}/xxxxx_api/saveMultiple\`,
            "GET_UPDATE": \`\$\{GROBAL_HTTP_CTX\}/xxxxx_api/updateMultiple\`,
            "GET_DELETE": \`\$\{GROBAL_HTTP_CTX\}/xxxxx_api/deleteBatch\`,
            "GET_LIST_BY_COL": \`\$\{GROBAL_HTTP_CTX\}/xxxxx_api/listByColumn\`,
            "GET_TOEXPORTEXCEL":\`\$\{GROBAL_HTTP_CTX\}/xxxxx_api/toExportExcel\`
        }

        /**
         * 获取列表
         * @param {*} params
         */
        export const getList = (param) => {
            let newParam = Object.assign({},param),
            pageParams = deepClone(newParam.pageParams);

            delete newParam.pageParams;

            return request(URL.GET_LIST, {
                method: "post",
                data : newParam,
                param : pageParams
            });
        }

        /**
        * 添加数据
        * @param {Array} data 数组对象批量添加
        * @returns {Promise}
        */
        export const adds = (data) => {
            return request(URL.GET_ADD, {
                method: "post",
                data
            });
        }

        /**
         * 删除数据
         * @param {Array} data 数组对象批量删除ids
         * @returns {Promise}
         */
        export const removes = (data) => {
            return request(URL.GET_DELETE, {
                method: "post",
                data
            });
        }

        /**
         * 修改数据
         * @param {Array} data 数组对象批量修改id+ts
         * @returns {Promise}
         */
        export const updates = (data) => {
            return request(URL.GET_UPDATE, {
                method: "post",
                data
            });
        }

        /**
         * 获取行过滤的下拉数据
         *   @param {*} params
         */
        export const getListByCol = (param) => {
            return request(URL.GET_LIST_BY_COL, {
                method: "get",
                param
            });
        }



        const selfURL = window[window.webkitURL ? 'webkitURL' : 'URL'];
        let exportData = (url, data) => {
            axios({
                method: 'post',
                url: url,
                data: data,
                responseType: 'blob'
            }).then((res) => {
                const content = res.data;
                const blob = new Blob([content]);
                const fileName = "导出数据.xls";

                let elink = document.createElement('a');
                if ('download' in elink) {
                    elink.download = fileName;
                    elink.style.display = 'none';
                    elink.href = selfURL['createObjectURL'](blob);
                    document.body.appendChild(elink);

                    // 触发链接
                    elink.click();
                    selfURL.revokeObjectURL(elink.href);
                    document.body.removeChild(elink)
                } else {
                    navigator.msSaveBlob(blob, fileName);
                }
            })
        }


                                                
    `;

    fs.writeFile(
        `${dir}/service.js`,
        prettier.format(serviceJSContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${dir}/service.js create success `.green
            );
        }
    );

    /*********************************/
    /******** create app.jsx *********/
    /*********************************/

    const appContent = `
            
        /**
         * 整个应用的入口，包含路由，数据管理加载
         */

        import React  from "react";
        import 'core-js/es6/map';
        import 'core-js/es6/set';
        import logger from "redux-logger";
        import mirror, { render,Router } from "mirrorx";
        import Routes from './routes'
        import 'tinper-bee/assets/tinper-bee.css';
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

    fs.writeFile(
        `${dir}/${appFileName}`,
        prettier.format(appContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${dir}/${appFileName} create success `.green
            );
        }
    );

    /************************************/
    /******** create index.html *********/
    /************************************/

    const indexHtmlContent = `

        <!DOCTYPE html>
        <html lang="zh-CN">

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

    fs.writeFile(
        `${dir}/${indexHtmmFileName}`,
        html_beautify(indexHtmlContent),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${dir}/${indexHtmmFileName} create success `.green
            );
        }
    );

    /***********************************/
    /******** create component *********/
    /***********************************/
 
    this.genA2Component(ComponentName, _pageName);
    this.genA2SearchArea(ComponentName, _pageName);

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

    fs.writeFile(
        `${routesDir}/index.js`,
        prettier.format(routesContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${routesDir}/index.js  create success `.green
            );
        }
    );
};







module.exports.genComponent = (_compName, pageName = "") => {
    const className = _.upperFirst(_.camelCase(_compName));
    const jsFileName = `index.jsx`;
    const lessFileName = `index.less`;
    const compDir =
        pageName == ""
            ? `./components/${className}`
            : `./${pageName}/components/${className}`;

    // mkdir module component folder
    if (!fs.existsSync(compDir)) {
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

    fs.writeFile(
        `${compDir}/${jsFileName}`,
        prettier.format(jsxContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${compDir}/${jsFileName} create success `.green
            );
        }
    );

    /************************************/
    /******** create less file **********/
    /************************************/

    // create less file
    fs.writeFile(`${compDir}/${lessFileName}`, "", err => {
        if (err) throw err;
        console.log(
            logSymbols.success,
            `${compDir}/${lessFileName} create success `.green
        );
    });
};




module.exports.genA2Component = (_compName, pageName = "") => {
    const className = _.upperFirst(_.camelCase(_compName));
    const jsFileName = `index.jsx`;
    const lessFileName = `index.less`;
    const modelName = _.camelCase(pageName);
    const compDir =
        pageName == ""
            ? `./components/${className}`
            : `./${pageName}/components/${className}`;

    // mkdir module component folder
    if (!fs.existsSync(compDir)) {
        fs.mkdirSync(compDir);
    }

    /***********************************/
    /******** create jsx file **********/
    /***********************************/
    let jsxContent = `  
 
    /**
     * A2单表行内编辑示例
     */

    //React组件
    import React, { Component } from 'react';
    //状态管理
    import { actions } from 'mirrorx';
    //Tinper-bee 组件库
    import { Loading, Message } from 'tinper-bee';
    //日期处理
    import moment from 'moment'

    //工具类
    import { uuid, deepClone, success, Error, Info, getButtonStatus, getHeight, getPageParam } from "utils";

    //Grid组件
    import Grid from 'components/Grid';
    //布局类组件
    import Header from 'components/Header';
    //项目级按钮
    import Button from 'components/Button';
    //项目级提示框
    import Alert from 'components/Alert';
    //按钮权限组件
    import ButtonRoleGroup from 'components/ButtonRoleGroup';

    //搜索区组件
    import SearchAreaForm from '../Search-area';
    //行编辑组件工厂
    import FactoryComp from './FactoryComp';

    //组件样式引用
    import 'ref-tree/dist/index.css';
    import 'ref-multiple-table/dist/index.css';
    import 'bee-datepicker/build/DatePicker.css';
    import 'bee-complex-grid/build/Grid.css';
    import 'bee-table/build/Table.css';
    import 'bee-pagination/build/Pagination.css';
    import 'bee-input-number/build/InputNumber.css';
    import './${lessFileName}';


    class ${className} extends Component {
        /**
         * Creates an instance of InlineEdit.
         * @param {*} props
         * @memberof InlineEdit
         */
        constructor(props) {
            super(props);
            this.state = {
                tableHeight: 0,
                showPop: false,//删除需要的状态
                showPopCancel: false//取消提示的状态
            }
        }
        //缓存数据
        oldData = [];

        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // https://openopen114.github.io/gen-grid-column-web/
        //定义Grid的Column
        column = [
            
        ];
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        componentWillMount() {
            //计算表格滚动条高度
            this.resetTableHeight(true);
        }
        /**
         * 渲染后执行的函数
         *
         * @memberof InlineEdit
         */
        componentDidMount() {
            //生命周期加载数据
            actions.${modelName}.loadList(this.props.queryParam);//初始化Grid数据
        }
        /**
         * 同步修改后的数据不操作State
         *
         * @param {string} field 字段
         * @param {any} value 值
         * @param {number} index 位置
         */
        changeAllData = (field, value, index) => {
            let oldData = this.oldData;
            let _sourseData = deepClone(this.props.list);
            oldData[index][field] = value;
            //有字段修改后去同步左侧对号checkbox
            if (_sourseData[index]['_checked'] != true) {
                _sourseData[index]['_checked'] = true;
                actions.${modelName}.updateState({ list: _sourseData });
            }
            oldData[index]['_checked'] = true;
            this.oldData = oldData;
        }

        /**
         * 处理验证后的状态
         *
         * @param {string} field 校验字段
         * @param {objet} flag 是否有错误
         * @param {number} index 位置
         */
        onValidate = (field, flag, index) => {
            //只要是修改过就启用校验
            if (this.oldData.length != 0) {
                this.oldData[index][\`_$\{field\}Validate\`] = (flag == null);
            }

        }

        /**
         * 点击多选框回调函数
         *
         * @param {object} selectData 选择的数据
         * @param {object} record 当前行数据，空为点击全选
         * @param {number} index 当前索引
         */
        getSelectedDataFunc = (selectData, record, index) => {
            let { list } = this.props;
            let _list = deepClone(list);
            //当第一次没有同步数据
            // if (this.oldData.length == 0) {
            //     this.oldData = deepClone(list);
            // }
            //同步list数据状态
            if (index != undefined) {
                _list[index]['_checked'] = !_list[index]['_checked'];
            } else {//点击了全选
                if (selectData.length > 0) {//全选
                    _list.map(item => {
                        if (!item['_disabled']) {
                            item['_checked'] = true
                        }
                    });
                } else {//反选
                    _list.map(item => {
                        if (!item['_disabled']) {
                            item['_checked'] = false
                        }
                    });
                }
            }
            actions.${modelName}.updateState({ selectData, list: _list });
        }
        /**
         * 跳转指定页码
         *
         * @param {*} pageIndex
         */
        freshData = (pageIndex) => {
            this.onPageSelect(pageIndex, 0);
        }

        /**
         * 分页  跳转指定页数和设置一页数据条数
         *
         * @param {*} index
         * @param {*} value
         */
        onDataNumSelect = (index, value) => {
            this.onPageSelect(value, 1);
        }

        /**
         * type为0标识为pageIndex,为1标识pageSize
         *
         * @param {*} value
         * @param {*} type
         */
        onPageSelect = (value, type) => {
            let queryParam = deepClone(this.props.queryParam); // 深拷贝查询条件从action里
            const { pageIndex, pageSize } = getPageParam(value, type, queryParam.pageParams);
            queryParam['pageParams'] = { pageIndex, pageSize };
            actions.${modelName}.updateState(queryParam); // 更新action queryParam
            actions.${modelName}.loadList(queryParam);
        }
        /**
         * 过滤数组中的非法null
         *
         * @param {array} arr
         */
        filterArrayNull = (arr) => {
            return arr.filter(item => (item != null));
        }
        /**
         * 检查是否可选状态
         *
         */
        hasCheck = () => {
            let { selectData, list } = this.props;
            let flag = false;
            selectData.map(item => {
                if (item._checked == true) {
                    flag = true;
                }
            });
            list.map(item => {
                if (item._checked == true) {
                    flag = true;
                }
            });
            return flag
        }

        /**
         * 新增行数据
         */
        handlerNew = () => {
            // actions.${modelName}.updateState({ selectData: [] });//清空checkbox选择字段
            let newData = deepClone(this.props.list);//克隆原始数据
            newData = newData.filter(item => !item._isNew);//去除新增字段

            // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            // https://openopen114.github.io/gen-grid-column-web/
            //这里是新增后的新数据模板，用于默认值
            let tmp = {
                key: uuid(),
                _edit: true,
                _isNew: true,
                _checked: false,
                _disabled: false,
                _flag: false, 
            }
            // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

            //newData.unshift(tmp);//插入到最前
            this.oldData.unshift(tmp);//插入到最前
            //禁用其他checked
            for (let i = 0; i < newData.length; i++) {
                newData[i]['_disabled'] = true;
                newData[i]['_checked'] = false;
                newData[i]['_status'] = 'new';
            }

            //重置操作栏位
            this.grid.resetColumns(this.column);
            //同步状态数据
            // this.oldData = deepClone(newData);
            //保存处理后的数据，并且切换操作态'新增'
            actions.${modelName}.updateState({ list: this.oldData.concat(newData), status: "new", rowEditStatus: false, selectData: [] });
        }

        /**
         * 修改
         */
        onClickUpdate = () => {
            let editData = [...this.props.list];
            //当前行数据设置编辑态
            for (let i = 0; i < editData.length; i++) {
                editData[i]['_edit'] = true;
                editData[i]['_checked'] = false;
                editData[i]['_status'] = 'edit';
            }
            //重置操作栏位
            this.grid.resetColumns(this.column);
            //同步操作数据
            this.oldData = deepClone(editData);
            //保存处理后的数据，并且切换操作态'编辑'
            actions.${modelName}.updateState({ list: editData, status: "edit", rowEditStatus: false });
        }

        /**
         * 下载模板
         *
         */
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        onClickDownloadTemplate = () => {
            window.open(\`\$\{GROBAL_HTTP_CTX\}/api_xxxxxxx/excelTemplateDownload\`);
        }
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        /**
         * 根据key关联对应数据后校验
         *
         * @param {array} data 要关联数据
         * @param {array} list 被关联数据
         * @returns
         */
        filterListKey = (data, list) => {
            let _list = list.slice();
            data.forEach((_data, _index) => {
                _list.forEach((item, i) => {
                    if (_data['key'] == item['key']) {
                        _list[i]['_validate'] = true;
                    }
                });
            });
            return _list;
        }
        /**
         * 根据id关联对应数据后校验
         *
         * @param {array} data 要关联数据
         * @param {array} list 被关联数据
         * @returns {array}
         */
        filterListId = (data, list) => {
            let _list = list.slice();
            data.forEach((_data, _index) => {
                _list.forEach((item, i) => {
                    if (_data['id'] == item['id']) {
                        _list[i]['_validate'] = true;
                    }
                });
            });
            return _list;
        }
        /**
         * 验证数据否正确
         *
         * @param {array} data 欲验证的数据
         * @returns {bool}
         */
        isVerifyData = (data) => {
            let flag = true;
            let pattern = /Validate\\b/;//校验的正则结尾
            data.forEach((item, index) => {
                let keys = Object.keys(item);
                //如果标准为false直接不参与计算说明已经出现了错误
                if (flag) {
                    for (let i = 0; i < keys.length; i++) {
                        if (pattern.test(keys[i])) {
                            if (data[index][keys[i]]) {
                                flag = true;
                            } else {
                                flag = false;
                                break;
                            }
                        }
                    }
                }
            });
            return flag
        }
        /**
         * 过滤左侧check选中后的数据
         *
         * @param {array} data 新增数据
         * @param {array} list 数据
         * @returns 选中后的数据
         */
        filterChecked = (data, list) => {
            let result = [];
            data.forEach((_data, _index) => {
                list.forEach((item) => {
                    if (_data['key'] == item['key'] && item['_checked']) {
                        result.push(_data);
                    }
                });
            });
            return result;
        }
        /**
         * 过滤选择的数据根据ID关联
         *
         * @param {array} data 新增数据
         * @param {array} selected 选择后的数据
         * @returns
         */
        filterSelectedById = (data, selected) => {
            let result = [];
            data.forEach((_data, _index) => {
                selected.forEach((item) => {
                    if (_data['id'] == item['id'] && item['_checked']) {
                        _data['_checked'] = true;
                        result.push(_data);
                    }
                });
            });
            return result;
        }
        /**
         * 过滤表格内的数据与左侧check同步数据根据id
         *
         * @param {array} data 数据
         * @param {array} list 来源数据
         * @returns 关联好的数据
         */
        filterSelectedListById = (data, list) => {
            let result = [];
            data.forEach((_data, _index) => {
                list.forEach((item) => {
                    if (_data['id'] == item['id'] && item['_checked']) {
                        _data['_checked'] = true;
                        result.push(_data);
                    }
                });
            });
            return result;
        }
        /**
         * 保存
         */
        onClickSave = async () => {
            let { status, list, selectData } = this.props;
            let data = deepClone(this.oldData);
            let _list = list.slice();
            switch (status) {
                case 'new':
                    //筛选新增的值
                    //筛选打过对号的
                    data = this.filterChecked(data, this.props.list);
                    //检查校验数据合法性
                    //查找对应的key关系来开启验证
                    _list = this.filterListKey(data, _list);
                    //开始校验actions
                    await actions.${modelName}.updateState({ list: _list });
                    //检查是否验证通过
                    if (this.isVerifyData(this.filterChecked(deepClone(this.oldData), this.props.list))) {
                        let vals = this.filterChecked(this.oldData, this.props.list);
                        if (vals.length == 0) {
                            Info('请勾选数据后再新增');
                        } else {
                            let newResult = await actions.${modelName}.adds(vals);
                            if (newResult) {
                                this.oldData = [];
                                success('新增成功');
                            } else {
                                Error('新增失败');
                            }
                        }
                    }
                    break;
                case 'edit':
                    //筛选打过对号的
                    data = this.filterSelectedById(data, selectData);
                    //如果没有找到继续从左侧找check数据
                    data = data.length == 0 ? this.filterSelectedListById(this.oldData, _list) : data;
                    //检查校验数据合法性
                    //查找对应的id关系来开启验证
                    _list = this.filterListId(data, _list);
                    await actions.${modelName}.updateState({ list: _list });
                    //检查是否验证通过
                    if (this.isVerifyData(data)) {
                        if (data.length == 0) {
                            Info('请勾选数据后再修改');
                        } else {
                            let editResult = await actions.${modelName}.updates(data);
                            if (editResult) {
                                this.oldData = [];
                                success('修改成功');
                            } else {
                                Error('修改失败');
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        /**
         * 删除询问Pop
         *
         */
        onClickDelConfirm = () => {
            let { selectData } = this.props;
            if (selectData.length > 0) {
                this.setState({
                    showPop: true
                });
            } else {
                Info('请勾选数据后再删除');
            }
        }
        /**
         * 删除
         */
        onClickDel = async () => {
            let { selectData } = this.props;
            let delResult = await actions.${modelName}.removes(selectData);
            if (delResult) {
                success('删除成功');
                this.oldData = [];
            } else {
                Error('删除失败');
            }
            this.setState({
                showPop: false
            });
        }

        /**
         * 取消
         *
         */
        onClickPopCancel = () => {
            this.setState({
                showPop: false
            });
        }
        /**
         * 表格内的取消
         */
        onClickCancel = () => {
            //检查是否有修改过的选中
            if (this.hasCheck()) {
                this.setState({ showPopCancel: true });
            } else {
                this.oldData = [];//清空上一次结果
                //重置store内的数据
                actions.${modelName}.resetData(true);
                //清空选中的数据
                actions.${modelName}.updateState({ selectData: [], rowEditStatus: true });
            }
        }
        /**
         *  新增或修改给出的确定
         *
         */
        onClickPopUnSaveOK = () => {
            //重置store内的数据
            actions.${modelName}.resetData(true);
            //清空选中的数据
            actions.${modelName}.updateState({ selectData: [], rowEditStatus: true });
            this.setState({ showPopCancel: false });
            this.oldData = [];
        }
        /**
         *  新增或修改给出的取消
         *
         */
        onClickPopUnSaveCancel = () => {
            this.setState({ showPopCancel: false });
        }
        /**
         * 导出数据
         *
         */
        onClickExport = () => {
            this.grid.exportExcel();
        }


        /**
         * 重置表格高度计算回调
         *
         * @param {bool} isopen 是否展开
         */
        resetTableHeight = (isopen) => {
            let tableHeight = 0;
            if (isopen) {
                //展开的时候并且适配对应页面数值px
                tableHeight = getHeight() - 420
            } else {
                //收起的时候并且适配对应页面数值px
                tableHeight = getHeight() - 270
            }
            this.setState({ tableHeight });
        }

        render() {
            const _this = this;
            let { showPop, showPopCancel, tableHeight } = _this.state;
            let { list, showLoading, pageIndex, pageSize, totalPages, total, status, rowEditStatus, queryParam } = _this.props;
            //分页条数据
            const paginationObj = {
                activePage: pageIndex,//当前页
                total: total,//总条数
                items: totalPages,
                freshData: _this.freshData,//刷新数据
                onDataNumSelect: _this.onDataNumSelect,//选择记录行
                disabled: status !== "view"//分页条禁用状态
            }
            return (
                <div className='inline-edit'>
                    <Header title='A2单表行内编辑示例' />
                    <SearchAreaForm
                        queryParam={queryParam}
                        status={status}
                        pageSize={pageSize}
                        searchOpen={true}
                        onCallback={this.resetTableHeight}
                    />
                    <div className='table-header'>
                        <ButtonRoleGroup
                            funcCode="singletable-inlineEdit"
                            onComplete={() => console.log('按钮权限加载完成')}
                        >
                            <Button role="add"
                                iconType="uf-plus"
                                disabled={getButtonStatus('add', status)}
                                className="ml8"
                                onClick={this.handlerNew}
                            >
                                新增
                            </Button>
                            <Button
                                role="update"
                                iconType="uf-pencil"
                                disabled={getButtonStatus('edit', status)}
                                className="ml8" onClick={this.onClickUpdate}
                            >
                                修改
                            </Button>
                            <Button
                                role="delete"
                                iconType="uf-del"
                                disabled={getButtonStatus('del', status)}
                                className="ml8"
                                onClick={this.onClickDelConfirm}
                            >
                                删除
                              </Button>
                            <Alert
                                show={showPop}
                                context="是否要删除 ?"
                                confirmFn={this.onClickDel}
                                cancelFn={this.onClickPopCancel}
                            />
                            <Button
                                iconType="uf-table"
                                disabled={getButtonStatus('down', status)}
                                className="ml8"
                                onClick={this.onClickDownloadTemplate}
                            >
                                下载模板
                         </Button>
                            <Button
                                iconType="uf-import"
                                disabled={getButtonStatus('import', status)}
                                className="ml8"
                            >
                                导入
                        </Button>
                            <Button
                                iconType="uf-export"
                                disabled={getButtonStatus('export', status)}
                                className="ml8"
                                onClick={this.onClickExport}
                            >
                                导出
                         </Button>
                            <Button
                                iconType="uf-save"
                                disabled={getButtonStatus('save', status)}
                                className="ml8"
                                onClick={this.onClickSave}
                            >
                                保存
                        </Button>
                            <Button
                                iconType="uf-back"
                                disabled={getButtonStatus('cancel', status)}
                                className="ml8"
                                onClick={this.onClickCancel}
                            >
                                取消
                        </Button>
                            <Alert
                                show={showPopCancel}
                                context="数据未保存，确定离开 ?"
                                confirmFn={this.onClickPopUnSaveOK}
                                cancelFn={this.onClickPopUnSaveCancel}
                            />
                        </ButtonRoleGroup>
                    </div>
                    <div className='grid-parent'>
                        <Grid
                            ref={(el) => this.grid = el}//ref用于调用内部方法
                            data={list}//数据
                            rowKey={r => r.id ? r.id : r.key}
                            columns={this.column}//定义列
                            paginationObj={paginationObj}//分页数据
                            columnFilterAble={rowEditStatus}//是否显示右侧隐藏行
                            showHeaderMenu={rowEditStatus}//是否显示菜单
                            dragborder={rowEditStatus}//是否调整列宽
                            draggable={rowEditStatus}//是否拖拽
                            syncHover={rowEditStatus}//是否同步状态
                            getSelectedDataFunc={this.getSelectedDataFunc}//选择数据后的回调
                            scroll={{ y: tableHeight }}
                        />
                    </div>
                    <Loading fullScreen={true} show={showLoading} loadingType="line" />
                </div>
            )
        }
    }

    export default ${className};


 

    `;

    fs.writeFile(
        `${compDir}/${jsFileName}`,
        prettier.format(jsxContent, {
            parser: "babel",
            plugins
        }),
        err => {
            if (err) throw err;
            console.log(
                logSymbols.success,
                `${compDir}/${jsFileName} create success `.green
            );
        }
    );

    /************************************/
    /******** create less file **********/
    /************************************/


    const lessContent = `
    .inline-edit {
    // gird 里 td 和 th 样式
    .grid-parent {
            .u-table-content {
                .u-table-row.u-table-row-level-0 {
                    td {
                        height: 40px !important;
                        padding: 0 8px;
                    }
                    th {
                        height: 54px;
                    }
                }
            }
        }
    }

    .underCursor{
      text-decoration: underline;
      color: #004898;
      cursor:pointer
    }




    .column-number-right{
        text-align: right;
    }

    `;

    // create less file
    fs.writeFile(`${compDir}/${lessFileName}`, lessContent, err => {
        if (err) throw err;
        console.log(
            logSymbols.success,
            `${compDir}/${lessFileName} create success `.green
        );
    });




    /***************************************/
    /******** create Factroy Comp **********/
    /***************************************/


    let factoryCompContent = `
       // generate whole factory component via https://openopen114.github.io/gen-grid-column-web/
    `

    // create less file
    fs.writeFile(`${compDir}/FactoryComp.jsx`, factoryCompContent, err => {
        if (err) throw err;
        console.log(
            logSymbols.success,
            `${compDir}/FactoryComp.jsx create success `.green
        );
    });


};





module.exports.genA2SearchArea = (_compName, pageName = "") => {
    const className = _.upperFirst(_.camelCase(_compName));
    const jsFileName = `index.jsx`;
    const lessFileName = `index.less`;
    const modelName = _.camelCase(pageName);
    const compDir =
        pageName == ""
            ? `./components/${className}`
            : `./${pageName}/components/Search-area`;

    // mkdir module component folder
    if (!fs.existsSync(compDir)) {
        fs.mkdirSync(compDir);
    }



    let searchAreaContent = `


        /**
         * A2行编辑搜索区域组件
         */

        //React所需
        import React, { Component } from 'react';
        //状态管理
        import { actions } from "mirrorx";
        //Tinper-bee组件库
        import { Col, Row, FormControl, Label } from "tinper-bee";
        //表单
        import Form from 'bee-form';
        //下拉
        import Select from 'bee-select';
        //日期
        import DatePicker from "tinper-bee/lib/Datepicker";
        //日期本地化
        import zhCN from "rc-calendar/lib/locale/zh_CN";

        //加载工具类
        import { deepClone } from "utils";
 
        //其他
        import SearchPanel from 'components/SearchPanel';
        import SelectMonth from 'components/SelectMonth';
        import Alert from 'components/Alert';
        import InputNumber from "bee-input-number";

        //样式导入
        import 'bee-datepicker/build/DatePicker.css';
        import 'ref-tree/dist/index.css';

        //所需变量
        const { FormItem } = Form;
        const { Option } = Select;
        const format = "YYYY";
        const { YearPicker } = DatePicker;


        class SearchAreaForm extends Component {

            constructor(props) {
                super(props);
                this.state = {
                    show: false
                }
            }

            /** 执行查询方法回调
             * @param {array} error 校验是否成功
             * @param {json} values 表单数据
             */
            search = (error, values) => {
                let { status } = this.props;
                //针对不同数据进行处理
                if (values.year) {
                    values.year = values.year.format('YYYY');
                }
                if (values.dept) {
                    values.dept = JSON.parse(values.dept).refpk;
                }
                //检测是否为编辑查询
                if (status != 'view') {
                    this.setState({
                        show: true,
                        values
                    });
                } else {
                    this.getQuery(values, 0);
                }
            }

            /**
             * 没退出编辑态后的查询确认
             *
             */
            onClickGo = () => {
                this.getQuery(this.state.values, 0);
                this.setState({ show: false });
                actions.${modelName}.updateState({ status: 'view', rowEditStatus: true });
            }

            /**
             * 没退出编辑态后的取消
             *
             */
            onClickCancel = () => {
                this.setState({ show: false });
            }

            /**
             * 重置 如果无法清空，请手动清空
             *
             */
            reset = () => {
                // this.props.form.validateFields((err, values) => {
                //     this.getQuery(values, 1)
                // });
            }

            /**
             * 获取数据  type值为0查询，1为清空
             *
             * @param {array} values 要处理的值
             * @param {number} type 不同类型
             */
            getQuery = (values, type) => {
                let queryParam = deepClone(this.props.queryParam);
                let { pageParams, whereParams } = queryParam;

                whereParams = deepClone(whereParams);
                pageParams.pageIndex = 0;
                for (let key in values) {
                    for (const [index, elem] of whereParams.entries()) {
                        if (key === elem.key) {
                            whereParams.splice(index, 1);
                            break;
                        }
                    }
                    if ((values[key] || values[key] === 0) && type === 0) {
                        let condition = "LIKE";
                        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        // 这里通过根据项目自己优化
                        const equalArray = [];
                        const greaterThanArray = [];
                        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        if (equalArray.includes(key)) { // 等于
                            condition = "EQ";
                        }
                        if (greaterThanArray.includes(key)) { // 大于等于
                            condition = "GTEQ";
                        }
                        whereParams.push({ key, value: values[key], condition }); //前后端约定
                    }
                }

                queryParam.whereParams = whereParams;
                if (type === 0) { // 查询
                    actions.${modelName}.loadList(queryParam);
                }
                // actions.${modelName}.updateState(queryParam);

            }


            render() {
                const { getFieldProps } = this.props.form;
                const { form, searchOpen, onCallback } = this.props;
                return (
                    <SearchPanel
                        className='edlin-form'
                        form={form}
                        searchOpen={searchOpen}
                        reset={this.reset}
                        onCallback={onCallback}
                        search={this.search}>
                        {/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
                        {/* generate search item row via  https://openopen114.github.io/gen-search-item-web/ */}
                        {/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
                        <Alert show={this.state.show} context="数据未保存，确定查询 ?" confirmFn={this.onClickGo} cancelFn={this.onClickCancel} />
                    </SearchPanel>
                )
            }
        }

        export default Form.createForm()(SearchAreaForm)


    `;


    // create search-area file
    fs.writeFile(`${compDir}/${jsFileName}`, searchAreaContent, err => {
        if (err) throw err;
        console.log(
            logSymbols.success,
            `${compDir}/${jsFileName} create success `.green
        );
    });
}

