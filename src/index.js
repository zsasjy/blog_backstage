import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store'
import {Provider} from 'react-redux'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

ReactDOM.render(<Provider store={store}><ConfigProvider locale={zhCN}><App/></ConfigProvider></Provider>, document.getElementById('root'));

