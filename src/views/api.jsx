import React,{Component} from 'react'

class Api extends Component{
    render(){
        return (
            <div style={{width:"100%",height:"850px"}}>
                <iframe src="/api" style={{width:"100%",height:"850px",border:"none"}} title="api"></iframe>
            </div>
        )
    }
}

export default Api