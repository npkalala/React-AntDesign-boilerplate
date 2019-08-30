import React from 'react';
import { inject, observer } from 'mobx-react';
import { queryCertificates } from 'services/API';
import { Table, Divider, Tag, Button, Badge, Card, Spin, Input, Icon, Row, Col  } from 'antd';
import * as moment from 'moment';

const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => <a>{text}</a>,
    },
    {
        title: 'SNIS',
        key:'snis',
        dataIndex: 'snis',
        render: (text) => text && text.length >0 && <Tag color="gray">{text[0]}</Tag>
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
            <Tag color="geekblue">
               <Icon type="info-circle"/> Details
            </Tag>
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
export default class Certificates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            isloading : true,
       }
       //this.updateDimensions = this.updateDimensions.bind(this);
    }
    componentDidMount = async () => {
        let dt = await queryCertificates();
        dt.data.data.map((row)=>{
            row.created_at = moment(row.create_at).toISOString(true);
        });
        data = dt.data.data;
        this.setState({data : data});
        this.setState({isloading : false});
    }

    queryData = (value) =>{
       let dt = data.filter(r=> r.id.indexOf(value) > -1);
       this.setState({data : dt});
    }
    
    render() {
    const { translateObj } = this.props.translateStore;
    const { Search } = Input;
    return (
      <div>
        {/* <Spin tip="Loading..." className = {this.state.isloading ? "show": "hide"}></Spin> */}
        <Card bordered={false} bodyStyle={{backgroundColor: 'rgba(228, 233, 237, 1)', border: 0 }}>
            <h1>Certificates</h1>
            <p>This is certificates</p>
            <p>Show the certificates infomation</p>
        </Card>
        <br/>
        <div>
          <Row>
            <Col span={16}>
              <Button type="primary" icon='plus'>ADD CERTIFICATE</Button>
            </Col>
            <Col span={8}>
              <Search placeholder="Search ID" onSearch={value => this.queryData(value)} enterButton />      
            </Col>
          </Row>
        </div>

        <Table columns={columns} dataSource={this.state.data} />
      </div>
    );
  }
}
