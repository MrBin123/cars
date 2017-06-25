import React from 'react'
import {Route,IndexRedirect} from "react-router"

import TableList from "../component/TableList"
import TableAdd from "../component/TableAdd"



export default(
	<Route path="/" >
		{/*<IndexRedirect to='/table/:id'></IndexRedirect>*/}
		<Route path="/table/:id" component={TableList}/>
		{/*<Route path="/tableadd" component={TableAdd}/>*/}
	</Route>)
