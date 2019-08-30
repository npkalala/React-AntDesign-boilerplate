import React from 'react';
import { Menu, Icon } from 'antd';
import { inject, observer } from 'mobx-react';
import * as Styles from './style';

const { SubMenu } = Menu;
@inject('translateStore')
@observer
export default class SideMenu extends React.Component {
  render() {
    const { translateObj } = this.props.translateStore;
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} inlineCollapsed={this.props.collapsed}>
        <Styles.MenuItem key="1" onClick={() => this.props.navigate('/app/about')}>
          <Icon type="user" />
          <span>DashBoard</span>
        </Styles.MenuItem>
        <SubMenu
          key="sub1"
          title={<span><Icon type="video-camera" /><span>API Gateway</span></span>}
        >
          {/* <Menu.Item key="2" onClick={() => this.props.navigate('/app/badge')}>{translateObj.BADGE}</Menu.Item>
          <Menu.Item key="3" onClick={() => this.props.navigate('/app/card')}>{translateObj.CARD}</Menu.Item>
          <Menu.Item key="4" onClick={() => this.props.navigate('/app/ringchart')}>{translateObj.RING_CHART}</Menu.Item> */}
          <Menu.Item key="5" onClick={() => this.props.navigate('/app/mixchart')}>{translateObj.MIX_CHART}</Menu.Item>
          <Menu.Item key="6" onClick={() => this.props.navigate('/app/upstream')}>UpStreams</Menu.Item>
          <Menu.Item key="7" onClick={() => this.props.navigate('/app/services')}>Services</Menu.Item>
          <Menu.Item key="8" onClick={() => this.props.navigate('/app/consumers')}>Consumers</Menu.Item>
          <Menu.Item key="9" onClick={() => this.props.navigate('/app/certificates')}>Certificates</Menu.Item>
          <Menu.Item key="10" onClick={() => this.props.navigate('/app/routes')}>Routes</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}
