import axios from 'axios'
import { message } from 'antd' 

function responseSuccess(response){
    if (response &&(response.status === 200 || response.status === 304 || response.status === 400)){
        if(response.data.status === 1001 || response.data.status === 10011 || response.data.status === 10012 || response.data.status === 10013 || response.data.status === 10014){
            return response.data;
        }else{
            if(response.data.status === 10055){
                message.warning(response.data.msg);
            }else{
                message.error(response.data.msg);
            }
            return;
        }
    }
    message.error("网络异常，请检查后重试");
}

function responseError(response){
    if (response.toString().indexOf("500")!==-1) {
        message.error("服务器异常，请联系管理员");
    }
    return response
}

function ajax(url,data={},method = 'GET'){
    if(method.toUpperCase() === "GET"){
        return axios({
            method,
            url,
            params:data,
            timeout: 40000,
            headers: {}
        }).then(Response => {
            return responseSuccess(Response);
        }).catch(Response => {
            return responseError(Response);
        })
    }
    if(method.toUpperCase() === "POST"){
        return axios({
            method,
            url,
            data,
            timeout: 3000000,
            headers: {}
        }).then(Response => {
            return responseSuccess(Response);
        }).catch(Response => {
            return responseError(Response);
        })
    }
}

export default ajax;