import React from 'react';
import { inject, observer } from 'mobx-react';
import { queryRoutes, queryService } from 'services/API';
import { Table, Divider, Tag, Button, Badge, Icon, Card, Spin, Input, Row, Col  } from 'antd';
import * as moment from 'moment';

//const { Title, Paragraph, Text } = Typography;
const columns = [
    {
        title: '',
        key:'eye',
        dataIndex: 'eye',
        render: (text) => <div><Icon type="disconnect"/> <Icon type="stop"/> <Icon type="eye"/></div>
    },
    {
      title: 'NAME/ID',
      dataIndex: 'id',
      key: 'id',
      render: text => <a>{text}</a>
    },
    {
      title: 'HOSTS',
      dataIndex: 'hosts',
      key: 'hosts',
      render: text => text!=null ? {text} : "-"
    },
    {
        title: 'SERVICE',
        dataIndex: 'service',
        key: 'service',
        render: text => <a>{text && text.name}</a>
    },
    {
        title: 'PATHS',
        dataIndex: 'paths',
        key: 'paths'
    },
    {
      title: 'CREATED',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <span>
            <Tag color="orange">
               <Icon type="edit"/> EDIT
            </Tag>
            <Tag color="red">
            <Icon type="delete"/> DELETE
            </Tag>
        </span>
      ),
    }
  ];
  
let data = [];
let dtService = [];
@inject('translateStore')
@observer
export default class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            isloading : true,
       }
    }
    componentDidMount = async () => {
        let dt = await queryRoutes();
        dtService = await queryService();
        dt.data.data.map((row)=>{
            row.created_at = moment(row.create_at).toISOString(true);
            if(row.service){
               row.service = this.getServiceById(row.service.id);
            }
            row.paths = row.paths.join();
        });
        data = dt.data.data;
        this.setState({data : data});
        this.setState({isloading : false});
    }

    queryData = (value) =>{
       let dt = data.filter(r=> r.id.indexOf(value) > -1);
       this.setState({data : dt});
    }

    getServiceById = (id) =>{
        if(!dtService){
            return null;
        }
        return dtService.data.data.find(row => row.id == id);
    }
    
    render() {
    const { translateObj } = this.props.translateStore;
    const { Search } = Input;
    return (
      <div>
        {/* <Spin tip="Loading..." className = {this.state.isloading ? "show": "hide"}></Spin> */}
        <Card bordered={false} bodyStyle={{backgroundColor: 'rgba(228, 233, 237, 1)', border: 0 }}>
            <h1>Routes</h1>
            <p>This is routes</p>
            <p>Show the routes infomation</p>
        </Card>
        <br/>
        <div>
          <Row>
            <Col span={16}>
                <Tag color="darkblue"> YOU CAN ONLY CREATE ROUTES FROM A SERVICE PAGE</Tag>
            </Col>
            <Col span={8}>
              <Search placeholder="Search NAME/ID" onSearch={value => this.queryData(value)} enterButton />      
            </Col>
          </Row>
        </div>

        <Table columns={columns} dataSource={this.state.data} />
      </div>
    );
  }
}
