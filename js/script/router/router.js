import React from 'react'
import {Route,IndexRedirect} from "react-router"

import TableList from "../component/TableList"



export default(
	<Route path="/" component={TableList}>
		<IndexRedirect to='/table'></IndexRedirect>
		<Route path="/table" component={TableList}/>
	</Route>)
