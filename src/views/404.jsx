import React,{Component} from 'react'
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom'
class Page_404 extends Component{
    render(){
        return (
            <div style={{padding:24}}>
                <Result
                    status="404"
                    title="404"
                    subTitle="对不起，您访问的页面不存在。"
                    extra={<Button type="primary"><Link to="/home">返回首页</Link></Button>}
                />
          </div>
        )
    }
}
export default Page_404