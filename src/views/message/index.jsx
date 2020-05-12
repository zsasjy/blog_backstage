import React,{Component} from 'react'
import { Row, Col, Menu, Tabs, Card, Badge, List, message, Spin, Button, Icon } from 'antd'
import './index.less'
import { reqMsgNotRead,reqMsgRead,reqMsgStatus,reqMsgDel } from '../../api'
import {connect} from 'react-redux'
import moment from 'moment'

const { TabPane } = Tabs;
class Message extends Component{
    constructor(){
        super();
        this.state={
            itemCount:"1",
            unreadlist:[],
            readlist:[],
            loading:false,
            waiting:false,
        }
    }
    menuItemClick(item){
        this.setState({itemCount:item.key})
    }
    // 初始化未读消息
    async initNotRead(){
        const result = await reqMsgNotRead({_id:this.props.user._id});
        if(result && result.status===10014){
            if(result.length!==0){
                // true 为未读 false为已读
                for(let i in result.data){
                    result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
                }
                this.setState({unreadlist:result.data,waiting:false});
            }
        }
    }
    // 初始化已读消息
    async initRead(){
        const result = await reqMsgRead({_id:this.props.user._id});
        if(result && result.status === 10014){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({readlist:result.data});
        }
    }
    // 修改读取状态
    async readMsg(item){
        this.setState({loading:true})
        const result = await reqMsgStatus({_id:item._id});
        if(result && result.status === 10013){
            let {unreadlist,readlist} = this.state;
            for(let i in unreadlist){
                if(unreadlist[i]._id === item._id){
                    message.success("操作成功")
                    let msgitem = unreadlist.splice(i,1);
                    readlist.unshift(msgitem[0])
                    this.setState({loading:false,unreadlist,readlist});
                    this.initNotRead();
                }
            }
        }
    }
    async deleteMsg(item){
        this.setState({loading:true})
        const result = await reqMsgDel({_id:item._id})
        if(result && result.status === 10012){
            let {readlist} = this.state;
            for(let i in readlist){
                if(readlist[i]._id === item._id){
                    message.success("操作成功")
                    readlist.splice(i,1);
                    this.setState({loading:false,readlist});
                }
            }
        }
    }

    UNSAFE_componentWillMount(){
        this.initNotRead();
        this.initRead();
    }
    render(){
        const {itemCount,unreadlist,readlist,loading,waiting} = this.state
        return(
            <div className="message">
                <Spin spinning={waiting}>
                    <Row span={24}>
                        <Col span={4} className="msg_wrap">
                            <Menu className="menuwrap" defaultSelectedKeys={['1']} onClick={(item)=>{this.menuItemClick(item)}}>
                                <Menu.Item className="menuitem" key="1">
                                    <Badge count={unreadlist.length}>
                                        未读消息
                                    </Badge>
                                </Menu.Item>
                                <Menu.Item className="menuitem" key="2">
                                    <Badge style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} count={readlist.length}>
                                        已读消息
                                    </Badge>
                                </Menu.Item>
                            </Menu>
                        </Col>
                        <Col span={20} className="msg_wrap">
                            <Card>
                                <Tabs tabBarStyle={{display:"none"}} className="msg_tabs" activeKey={itemCount}>
                                    <TabPane tab="Tab 1" key="1">
                                        <Spin spinning={loading}>
                                            <List
                                                dataSource={unreadlist}
                                                renderItem={(item) => (
                                                <List.Item key={item._id}>
                                                    <List.Item.Meta
                                                    title={item.name}
                                                    description={<div>{item.content}<p>{item.createTime}</p></div>}
                                                    />
                                                    <span><Button type="primary" onClick={()=>{this.readMsg(item)}}><Icon type="check"/>标为已读</Button></span>
                                                </List.Item>
                                                )}
                                            />
                                        </Spin>
                                    </TabPane>
                                    <TabPane tab="Tab 2" key="2">
                                        <Spin spinning={loading}>
                                            <List
                                                dataSource={readlist}
                                                renderItem={item => (
                                                <List.Item key={item._id}>
                                                    <List.Item.Meta
                                                    title={item.name}
                                                    description={<div>{item.content}<p>{item.createTime}</p></div>}
                                                    />
                                                    <span><Button type="danger" onClick={()=>{this.deleteMsg(item)}}><Icon type="rest"/>删除</Button></span>
                                                </List.Item>
                                                )}
                                            />
                                        </Spin>
                                    </TabPane>
                                </Tabs>
                            </Card>
                        </Col>
                    </Row>
                </Spin>
            </div>
        )
    }
}

export default connect(
    state => ({user:state.user})
)(Message)