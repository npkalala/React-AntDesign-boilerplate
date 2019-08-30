import React from 'react';
import { inject, observer } from 'mobx-react';
import { queryService } from 'services/API';
import { Table, Tag, Button, Icon, Card, Input, Row, Col } from 'antd';
import * as moment from 'moment';
import MasterForm from 'components/DetailForm/MasterForm';
let data = [];

@inject('translateStore')
@observer
export default class Service extends MasterForm { //React.Component { //MasterForm { 
    constructor(props) {
        super(props);
        this.columns = [
          {
              title: '',
              key:'id',
              dataIndex: 'id',
              render: (text, record) =><Icon type="eye" onClick={()=> this.readrow(record)}/>
          },
          {
            title: 'NAME',
            dataIndex: 'name',
            key: 'name',
            validate : {required : true , max : 20},
            render: (text, record) => <a onClick={()=> this.updaterow(record)}>{text}</a>,
          },
          {
            title: 'HOST',
            dataIndex: 'host',
            key: 'host',
          },
          {
            title: 'TAGS',
            dataIndex: 'tags',
            key: 'tags',
            dataset : [{value:"A", key:"10000"},{value:"B", key:"20000"}],
            default : "A"
            //validate : {required : true}
          },
          {
            title: 'CREATED',
            dataIndex: 'created_at',
            key: 'created_at',
            default: moment(Date.now()).toISOString(true),
            attributes : {disabled : true}
          },
          {
            title: '',
            key: 'action',
            render: (text, record) => (
              <span>
                  <Tag color="red" onClick = {()=>this.deleterow(record)}>
                  <Icon type="delete"/> DELETE
                  </Tag>
              </span>
            ),
          }
        ];
        
        this.state = {
            data : [],
       }
    }

    componentDidMount = async () => {
        let dtAll = await queryService();
        dtAll.data.data.map((row)=>{
            row.created_at = moment(row.create_at).toISOString(true);
        });
        data = dtAll.data.data;
        this.setState({data : data});
        this.setState({isloading : false});
    }

    queryData = (value) =>{
        let dt = data.filter(r=> r.name.indexOf(value) > -1);
        this.setState({data : dt});
    }

    // handleOK = (row) =>{
    //   console.log('child node');
    //   super.handleOK(row);
    // }

    render() {
    //const { translateObj } = this.props.translateStore;
    const { Search } = Input;
    return (
      <div>
        <Card bordered={false} bodyStyle={{backgroundColor: 'rgba(228, 233, 237, 1)', border: 0 }}>
            <h1>Services</h1>
            <p>This is services</p>
            <p>Show the services infomation</p>
        </Card>
        <br/>
        <div>
          <Row>
            <Col span={16}>
              <Button type="primary" icon='plus' onClick={this.addrow}>ADD NEW SERVICE</Button>
            </Col>
            <Col span={8}>
              <Search placeholder="Search NAME" onSearch={value => this.queryData(value)} enterButton />      
            </Col>
          </Row>
        </div>
        {/* <Table columns={this.columns} dataSource={this.state.data} /> */}
        {this.renderUI()}
      </div>
    );
  }
}
