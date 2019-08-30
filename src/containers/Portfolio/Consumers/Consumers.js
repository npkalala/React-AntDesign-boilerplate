import React from 'react';
import { inject, observer } from 'mobx-react';
import { queryConsumers } from 'services/API';
import { Table, Divider, Tag, Button, Badge, Icon, Card, Spin, Input, Row, Col  } from 'antd';
import * as moment from 'moment';

//const { Title, Paragraph, Text } = Typography;
const columns = [
    {
        title: '',
        key:'id',
        dataIndex: 'id',
        render: (text) =><Icon type="eye"/>
    },
    {
      title: 'NAME',
      dataIndex: 'username',
      key: 'username',
      render: text => <a>{text}</a>,
    },
    {
      title: 'CUSTOM_ID',
      dataIndex: 'custom_id',
      key: 'custom_id',
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
            <Tag color="red">
            <Icon type="delete"/> DELETE
            </Tag>
        </span>
      ),
    }
  ];
  
let data = [];

@inject('translateStore')
@observer
export default class Consumers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            isloading : true
       }
       //this.updateDimensions = this.updateDimensions.bind(this);
    }
    componentDidMount = async () => {
        let dtAll = await queryConsumers();
        dtAll.data.data.map((row)=>{
            row.created_at = moment(row.create_at).toISOString(true);
        });
        data = dtAll.data.data;
        this.setState({data : data});
        this.setState({isloading : false});
    }

    queryData = (value) =>{
        let dt = data.filter(r=> r.username.indexOf(value) > -1);
        this.setState({data : dt});
     }
    
    render() {
    const { translateObj } = this.props.translateStore;
    const { Search } = Input;
    return (
      <div>
        <Card bordered={false} bodyStyle={{backgroundColor: 'rgba(228, 233, 237, 1)', border: 0 }}>
            <h1>Consumers</h1>
            <p>This is consumers</p>
            <p>Show the consumers infomation</p>
        </Card>
        <br/>
        <div>
          <Row>
            <Col span={16}>
              <Button type="primary" icon='plus'>CREATE CONSUMER</Button>
            </Col>
            <Col span={8}>
              <Search placeholder="Search USERNAME" onSearch={value => this.queryData(value)} enterButton />      
            </Col>
          </Row>
        </div>
        <Table columns={columns} dataSource={this.state.data} />
      </div>
    );
  }
}
