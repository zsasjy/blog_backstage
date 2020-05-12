import React,{Component} from 'react'
import { Tabs, message, List, Tag, Empty, Timeline, Row, Col, Card } from 'antd';
import { reqUserWorks,reqTypeFind } from '../../api'
import moment from 'moment'

const { TabPane } = Tabs;
const { Meta } = Card;
class Works extends Component{
    constructor(){
        super();
        this.state = {
            appslist:[],
            notelist:[],
            artlist:[],
        }
    }
    async getInitWorks(value){
        const result = await reqUserWorks({author:value});
        if(result&&result.status===10014){
            if(result.data.artlist){
                const data = await reqTypeFind();
                if(data && data.status===10014){
                    for(let i in result.data.artlist){
                        for(let j in data.data){
                            if(result.data.artlist[i].typeId === data.data[j]._id){
                                result.data.artlist[i].typeId = data.data[j].name
                            }
                        }
                    }
                    this.setState({...result.data});
                }
            }
        }else{
            message.error("数据获取失败,请刷新重试");
        }
    }
    componentDidMount(){
        this.getInitWorks(this.props.user.name);
    }
    render(){
        let {artlist,notelist,appslist} = this.state
        return (
            <Tabs className="own-tab" defaultActiveKey="1">
                <TabPane className="tabPane" tab={`文章（${artlist.length}）`} key="articles">
                    {
                        artlist.length===0?<Empty style={{margin:"90px 0"}}/>
                        :<List itemLayout="vertical" size="large" dataSource={artlist}
                        renderItem={item => (
                        <List.Item extra={ <img width={272} height={200} alt="文章图片" src={item.imgs}/>  }
                            key={item._id} className="tab-list-item">
                            <List.Item.Meta title={<a className="item-title">{item.name}</a>}
                                description={<span><Tag>{item.typeId}</Tag> 作者: <strong>{item.author}</strong></span>}
                            />
                            <div className="item-desc">{item.desc}</div>
                            <p className="item-time">{`发表于 ${moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}`}</p>
                       </List.Item>)}
                    />
                    }
                </TabPane>
                <TabPane className="tabPane" tab={`随笔（${notelist.length}）`} key="notes">
                    {
                        notelist.length===0?<Empty style={{margin:"90px 0"}}/>:
                        <Timeline style={{padding:50}}>
                            {
                                notelist.map((item)=>{
                                    return (<Timeline.Item key={item._id}>
                                        <p>{item.content}</p>
                                        {item.imgs!==""?<img style={{maxWidth:700,maxHeight:300}} src={item.imgs} alt="图片"/>:""}
                                    </Timeline.Item>)
                                })
                            }
                        </Timeline>
                    }
                </TabPane>
                <TabPane className="tabPane" tab={`上传应用（${appslist.length}）`} key="apps">
                    {
                        appslist.length===0?<Empty style={{margin:"90px 0"}}/>:
                        <Row span={24}>
                            {appslist.map((item)=>{
                                return <Col key={item._id} span={8} style={{paddingLeft:8,paddingRight:8}}>
                                        <Card
                                        hoverable
                                        style={{ width: "100%"}}
                                        cover={<img alt="example" style={{width:"100%",height:200}} src={item.img} />}
                                    >
                                        <Meta  title={item.name} description={item.desc} />
                                    </Card>
                                </Col>
                            })}
                        </Row>
                    }
                </TabPane>
            </Tabs>
        )
    }
}
export default Works


// image/file-319a71e5c5366810ae4f4fda2f322521.png