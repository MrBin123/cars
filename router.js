import React from 'react'
import {Route,IndexRedirect} from "react-router"

import TableList from "../component/TableList"
import UsersManages from "../component/UsersManages"


export default(
	<Route path="/" >
		{/*<IndexRedirect to='/table/:id'></IndexRedirect>*/}
		<Route path="/table/:id" component={TableList}/>
		{/*<Route path="/tableadd" component={TableAdd}/>*/}
		<Route path="/all" component={UsersManages}/>
	</Route>)
