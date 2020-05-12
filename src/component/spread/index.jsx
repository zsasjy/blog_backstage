import React,{ Component } from "react"
// import ReactEcharts from 'echarts-for-react';
import chinaJson from '../../assets/china.json'
import dimension from '../../assets/geography-value'
import echarts from 'echarts'
class Spread extends Component{
    constructor(){
        super();
        this.state = {
            data : [
                {name: '北京', value: 30},
                {name: '廊坊', value: 25},
                {name: '延安', value: 40},
                {name: '太原', value: 30},
                {name: '清远', value: 35},
            ],
            geoData : dimension
        }
    }
 
    convertData = function(data) {
        let res = [];
        let len = data.length;
        for (var i = 0; i < len; i++) {
            var geoCoord = this.state.geoData[data[i].name];
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value)
                });
            }
        }
        return res;
    };
    setMapElement = n => {
        this.mapNode = n;
    };
    componentDidMount() {
        this.createMap(this.mapNode);
    }
    createMap = (element)=>{
        var map = echarts.init(element);
        echarts.registerMap("china", chinaJson);
        map.setOption({  
            backgroundColor: '#FFFFFF',  
            title: {  
                text: '用户访问统计',  
                subtext: '',  
                left: 'left',
                align: 'right' 
            },  
            tooltip : {  
                trigger: 'item'  
            },  
            
            
            geo: {
                map: "china",
                label: {
                emphasis: {
                    show: false
                }
                },
                itemStyle: {
                    normal: {
                        areaColor: "#EEEEEE",
                        borderColor: "#CCC"
                    },
                    emphasis: {
                        areaColor: "#E5E5E5"
                    }
                }
            },
            grid: {
                top: 0,
                left: "2%",
                right: "2%",
                bottom: "0",
                containLabel: true
            },
            //配置属性
            series: [
                {
                type: "scatter",
                coordinateSystem: "geo",
                data: this.convertData(this.state.data),
                symbolSize: function(val) {
                    return val[2]/5;
                },
                label: {
                    normal: {
                        formatter: "{b}",
                        position: "right",
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: "#0099CC"
                    }
                }
            }]
        })  
        setTimeout(function() {
            map.resize();
        }, 300);
        window.addEventListener("resize", function() {
            map.resize();
        });
    }
    render(){
        return (<div style={{width:"calc(100% - 10px)",height:500}} ref={this.setMapElement}></div>)
    }
}

export default Spread;