import { useState } from 'react';
import { Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import { MailOutlined, AppstoreOutlined } from '@ant-design/icons';

const PageMenu = () => {
  let history = useHistory();
  const [current, setCurrent] = useState('index');

  const handleClick = e => {
    setCurrent(e.key);
    history.push(`/${e.key}`);
  }

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="index" icon={<MailOutlined />}>
        首页
      </Menu.Item>
      <Menu.Item key="detail" icon={<AppstoreOutlined />}>
        详情页
      </Menu.Item>
    </Menu>
  )
}

export default PageMenu;