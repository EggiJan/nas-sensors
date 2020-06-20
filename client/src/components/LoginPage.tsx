import * as React from 'react'
import { Result } from 'antd';
import LoginButton from './LoginButton';

const LoginPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Result
        title="You're logged out. Please log in again."
        extra={
          <LoginButton />
        }
      />
    </div>
  )
};

export default LoginPage;