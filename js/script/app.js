require('../style/vendor/antd.min.css')
require('../style/app.less')
import React from 'react'
import ReactDOM from "react-dom"
import {Router,hashHistory} from "react-router"
import Routes from './router/router'

ReactDOM.render(
		<Router history= {hashHistory} routes={Routes} />,
		document.getElementById('car')
	
)
