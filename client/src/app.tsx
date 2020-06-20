import * as React from 'react'
import { Layout, Typography, Row, Col, Button, Spin } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
import "antd/dist/antd.css";
import DateRangePicker from './components/DateRangePicker';
import { DateRangeContextProvider } from './components/DateRangeContext';
import { StateContextProvider } from './components/StoreContext';
import ChartLayout from './components/ChartLayout';
import { useAuth0 } from './components/AuthenticationContext';
import "./index.css";
import LoginPage from './components/LoginPage';

const App: React.FC = () => {
  const { isAuthenticated, logout, user, loading } = useAuth0();

  if (loading) {
    return <Spin />
  }

  return (
    <>
      {!isAuthenticated && <LoginPage />}
      {isAuthenticated && <StateContextProvider>
        <DateRangeContextProvider>
          <Layout>
            <Layout.Header>
              <Row>
                <Col span={16}>
                  <Title style={{ color: 'white' }} level={1}>NAS Sensors</Title>
                </Col>
                <Col span={4}>
                  <DateRangePicker />
                </Col>
                <Col span={4}>
                  {isAuthenticated && <>
                    {user && <Text style={{ color: 'white', marginRight: 8}}>Hi, {user.nickname}</Text>}
                    &nbsp;
                    <Button
                      onClick={() => logout()}
                      type='primary'
                      icon={<LogoutOutlined />}
                      title='Logout'
                      />
                    
                  </>}
                </Col>
              </Row>
            </Layout.Header>
            <Layout.Content>
              <ChartLayout />
            </Layout.Content>
          </Layout>
        </DateRangeContextProvider>
      </StateContextProvider>}
    </>
  )
}

export default App;

