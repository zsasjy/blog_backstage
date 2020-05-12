import React,{Component} from 'react'
import { Card, Row, Col, Tag, Divider, Progress, Avatar, Tooltip, Timeline, Spin, Icon} from 'antd'
import './index.less'
import ReactEcharts from 'echarts-for-react';
import Spread from '../../component/spread'
import { reqChartH }  from '../../api'
import moment from 'moment'
class Home extends Component{
    state = {
        chart : {},
        users : [],
        applications : [],
        notes : [],
        articles: [],
        logs: [],
        weekArt:[],
        appsWeek:[],
        yearAllCounts:[],
        loading:true,
        data : [
            {name: '北京', value: 30},
            {name: '廊坊', value: 25},
            {name: '延安', value: 40},
            {name: '太原', value: 30},
            {name: '清远', value: 35},
        ],
    }
    initChart = async () => {
        const result = await reqChartH();
        if(result && result.data){
            if(result.data.us&&result.data.logs&&result.data.apps&&result.data.ns&&result.data.arts&&result.data.weekArt&&result.data.appsWeek&&result.data.yearAllCounts){
                result.data.yearAllCounts.app.unshift('新增上传量');
                result.data.yearAllCounts.ns.unshift('新增随笔');
                result.data.yearAllCounts.us.unshift('新增用户');
                result.data.yearAllCounts.arts.unshift('新增文章');
                for(let i in result.data.logs){
                    result.data.logs[i].createTime = moment(result.data.logs[i].createTime).format('YYYY-MM-DD HH:mm:ss');
                }
                this.setState({
                    chart:result.data,
                    users:result.data.us,
                    logs:result.data.logs,
                    applications:result.data.apps,
                    notes:result.data.ns,
                    articles:result.data.arts,
                    weekArt:result.data.weekArt,
                    appsWeek:result.data.appsWeek,
                    yearAllCounts:result.data.yearAllCounts
                })
            }
        }
    }
    setTitle(){
        return document.title = "网站后台管理系统"
    }
    componentDidMount(){
        this.setTitle();
        this.initChart();
        this.setState({loading:false})
    }
    render(){
        let {chart,users,notes,articles,applications,weekArt,yearAllCounts,logs,loading} = this.state;
        let {app,ns,us,arts} = yearAllCounts;
        let option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                show:false,
                splitLine: {
                    show: false
                }
            },
            grid:{
                x:2,
                y:0,
                x2:2,
                y2:0,
                height:42,
            },
            yAxis: {
                type: 'value',
                axisLine:{       //y轴
                    show:false
                },
                axisTick:{       //y轴刻度线
                    show:false
                },
                splitLine: {     //网格线
                    show: false
                },
                axisLabel:{
                    show:false
                },
                max:function(value){
                    return 4;
                }
            },
            series: [{
                data: this.state.appsWeek,
                type: 'line',
                areaStyle:{}
            }]
        };
        let options = {
            title: {
                text: '文章新增数量图',
                subtext: '数据来自后台管理系统',
                left: 'left',
                align: 'right'
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '文章增加数量',
                    type: 'bar',
                    barWidth: '60%',
                    data: weekArt
                }
            ]
        };
        let optionto = {
            title: {
                text: `${new Date().getMonth() + 1}月份 - 数据统计图`,
                subtext: '数据来自后台管理系统',
                left: 'left',
                align: 'right'
            },
            legend: {},
            tooltip: {
                trigger: 'axis',
                showContent: false
            },
            dataset: {
                source: [
                    ['product', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    app||[],
                    ns||[],
                    us||[],
                    arts||[]
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {gridIndex: 0},
            grid: {top: '55%'},
            series: [
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                {
                    type: 'pie',
                    id: 'pie',
                    radius: '30%',
                    center: ['50%', '25%'],
                    label: {
                        formatter: `{b}: {@${new Date().getMonth() + 1}月} ({d}%)`
                    },
                    encode: {
                        itemName: 'product',
                        value: `${new Date().getMonth() + 1}月`,
                        tooltip: `${new Date().getMonth() + 1}月`
                    }
                }
            ]
        };
        const antIcon = <Icon type="loading" style={{ fontSize: 48 }} spin />
        return (
            <div className="home">
                <Spin spinning={loading} indicator={antIcon} style={{textAlign:'center',height:"100%"}}>
                <Row span={24}>
                    <Col span={6} xs={24} sm={12} md={12} lg={12} xl={6} style={{paddingLeft:12,paddingRight:12,marginBottom:24}}>
                        <Card 
                            title="新增随笔量"
                            hoverable={true}
                            extra={<Tag color="green">日</Tag>}
                        >
                            <div>
                                <span style={{fontSize:30}}>{notes.length}</span>
                                <div style={{paddingTop:8,height: 42}}>
                                    <span style={{display:"inline-block",marginRight:16,color:"#AAAAAA"}}>
                                        {notes.length!==0?notes[0].content:"暂无随笔发布"}
                                    </span>
                                </div>
                                <Divider style={{margin:"8px 0px"}}/>
                                <Row>
                                    <Col span={12}>总随笔量</Col>
                                    <Col span={12} style={{textAlign:"right"}}>{chart.noteAllLength}个</Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6} xs={24} sm={12} md={12} lg={12} xl={6} style={{paddingLeft:12,paddingRight:12,marginBottom:24}}>
                        <Card 
                            title="新增文章量"
                            hoverable={true}
                            extra={<Tag color="cyan">月</Tag>}
                        >
                            <div>
                                <span style={{fontSize:30}}>{articles.length}</span>
                                <div style={{paddingTop:8,height: 42}}>
                                    <Progress style={{height:10}} percent={parseInt((articles.length/chart.artAllLength)*100)} showInfo={false} />
                                </div>
                                <Divider style={{margin:"8px 0px"}}/>
                                <Row>
                                    <Col span={12}>总文章量</Col>
                                    <Col span={12} style={{textAlign:"right"}}>{chart.artAllLength}个</Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6} xs={24} sm={12} md={12} lg={12} xl={6} style={{paddingLeft:12,paddingRight:12,marginBottom:24}}>
                        <Card 
                            title="新增上传量"
                            hoverable={true}
                            extra={<Tag color="orange">周</Tag>}
                        >
                            <div>
                                <span style={{fontSize:30}}>{applications.length}</span>
                                <div style={{paddingTop:8,height: 42}}>
                                    <ReactEcharts style={{height:40,width:"100%"}} option={option}></ReactEcharts>
                                </div>
                                <Divider style={{margin:"8px 0px"}}/>
                                <Row>
                                    <Col span={12}>总上传量</Col>
                                    <Col span={12} style={{textAlign:"right"}}>{chart.appAllLength}个</Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6} xs={24} sm={12} md={12} lg={12} xl={6} style={{paddingLeft:12,paddingRight:12,marginBottom:24}}>
                        <Card 
                            title="新增用户"
                            hoverable={true}
                            >
                            <div>
                                <span style={{fontSize:30}}>{users.length}</span>
                                <div style={{paddingTop:8,height: 42}}>
                                    {
                                        users.map((item)=>{
                                            return <div key={item._id} className="avatar-list-item">
                                                    <Tooltip placement="top" title={item.name}>
                                                        <Avatar src={item.headImg}/>
                                                    </Tooltip>
                                                </div>
                                        })
                                    }
                                    <div className="avatar-list-item">
                                        <Avatar style={{ backgroundColor: "#F56A00", verticalAlign: 'middle' }}>
                                         + {users.length}
                                        </Avatar>
                                    </div>
                                </div>
                                <Divider style={{margin:"8px 0px"}}/>
                                <Row>
                                    <Col span={12}>总用户量</Col>
                                    <Col span={12} style={{textAlign:"right"}}>{chart.usAllLeng}人</Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12} xs={24} sm={24} md={24} lg={24} xl={24} xxl={12} style={{padding:"0 12px"}}>
                        <Card >
                            <ReactEcharts style={{height:400}} option={options}></ReactEcharts>
                        </Card>
                    </Col>
                    <Col span={12} xs={24} sm={24} md={24} lg={24} xl={24} xxl={12} style={{padding:"0 12px"}}>
                        <Card >
                            <ReactEcharts style={{height:400}} option={optionto}></ReactEcharts>
                        </Card>
                    </Col>
                    <Col span={18} xs={24} sm={24} md={24} lg={24} xl={18} style={{padding:"0 12px",marginTop:18}}>
                        <Card style={{padding:16}}>
                            <Row span= {24}>
                                <Col span= {18} style={{padding:"0 12px"}}><Spread/></Col>
                                <Col span= {6} style={{padding:"0 12px"}}>
                                    <div className="content">
                                        {
                                            this.state.data.map((item,index)=>{
                                                return <div key={index} className="card-progress">
                                                <h5 className='title'>
                                                    {item.value}
                                                    <small>{item.name}</small>
                                                </h5>
                                                <Progress key={item._id} percent={Math.ceil(parseFloat(item.value/160)*100)} status="active" />
                                            </div>
                                            })
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={6} xs={24} sm={24} md={24} lg={24} xl={6} style={{padding:"0 12px",marginTop:18}}>
                        <Card
                        title="最新事件">
                            <Timeline style={{paddingTop:20,overflow:"auto",height:480}}>
                                {
                                    logs.map((item,index)=>{
                                        if(item.name.indexOf('添加')!==-1){
                                            return <Timeline.Item color='green' key={index}><p>{item.createTime}</p>{`用户 ${item.user} 进行了 ${item.name}操作`}</Timeline.Item>
                                        }else if(item.name.indexOf('删除')!==-1){
                                            return <Timeline.Item color='red' key={index}><p>{item.createTime}</p>{`用户 ${item.user} 进行了 ${item.name}操作`}</Timeline.Item>
                                        }else if(item.name.indexOf('上传')!==-1){
                                            return <Timeline.Item color='grey' key={index}><p>{item.createTime}</p>{`用户 ${item.user} 进行了 ${item.name}操作`}</Timeline.Item>
                                        }
                                        return <Timeline.Item key={index}><p>{item.createTime}</p>{`用户 ${item.user} 进行了 ${item.name}操作`}</Timeline.Item>
                                    })
                                }
                            </Timeline>
                        </Card>
                    </Col>
                </Row>
                </Spin>
            </div>
        )
    }
}

export default Home;