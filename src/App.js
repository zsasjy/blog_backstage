import React,{Component} from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import Login from './views/login'
import Layouts from './views/layout'
import SignUp from './views/signup'
import './assets/css/default.less'
import './assets/css/pace-flash.min.css'
import 'antd/dist/antd.less'

class App extends Component {
    state={
        loading:true,
    }
    componentDidMount(){
        this.setState({loading:false})
    }
    render(){
        const {loading} = this.state
        return(
            <div className="App">
                {/* 路由器 */}
                {
                    loading?<div id="preloader">
                        <div className="refresh-preloader"><div className="preloader"><i>.</i><i>.</i><i>.</i></div></div>
                    </div>
                    :<BrowserRouter>
                        <Switch>
                            <Route path='/signup' component={ SignUp }></Route>
                            <Route path='/login' component={ Login }></Route>
                            <Route path='/' component={ Layouts }></Route>
                        </Switch>
                    </BrowserRouter>
                }
            </div>
        )
    }
}

export default App;