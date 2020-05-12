import React,{Component} from 'react'
import { Card, Row, Col, Avatar, Icon, Descriptions  } from 'antd'
import {connect} from 'react-redux'
import moment from 'moment'
import Works from './works'
import './index.less'

class Ownspace extends Component{
    constructor(props){
        super(props);
        this.state={
            user:this.props.user
        }
    }
    UNSAFE_componentWillMount(){
        // this.user = ;
    }
    render(){
        const {user} = this.state;
        user.createTime = moment(user.createTime).format('YYYY-MM-DD HH:mm:ss');
        return (
            <div className="ownspace">
                <Row span={24}>
                    <Col span={7}>
                        <Card
                            style={{borderRadius:5}}
                            hoverable={true}
                            className="own-body"
                        >
                            <Avatar size={100} src={user.headImg} />
                            <p style={{margin:10}}>
                                <strong style={{fontSize: 20}}>{user.name}</strong>
                            </p>
                            <p>{user.synopsis}</p>
                            <Descriptions style={{textAlign:"left"}} column={24}>
                                <Descriptions.Item
                                    className="own-body-item"
                                    span={24}
                                    label={(<span className="label"><Icon type="mobile" style={{marginRight:10}}/> 手机</span>)}
                                >
                                    {user.phone}
                                </Descriptions.Item>
                                <Descriptions.Item span={24}
                                    className="own-body-item"
                                    label={(<span className="label"><Icon type='mail' style={{marginRight:10}}/> 邮箱</span>)}
                                >
                                    {user.email}
                                </Descriptions.Item>
                                <Descriptions.Item span={24}
                                    className="own-body-item"
                                    label={(<span className="label"><Icon type="clock-circle" style={{marginRight:10}}/>创建时间</span>)}
                                >
                                    {user.createTime}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col span={17}>
                        <Works user={user}/>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user})
)(Ownspace)