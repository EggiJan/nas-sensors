import * as React from 'react';
import { useState } from 'react';
import { useAuth0 } from './AuthenticationContext';
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const [loginError, setLoginError] = useState<string|undefined>();

  const handleLoginClick = () => {
    loginWithRedirect().catch(err => {
      setLoginError(`Login Failed - ${err}`);
    })
  };

  return (
    <>
      <Button
        type='primary'
        onClick={() => handleLoginClick()}
        size='large'
        icon={<LoginOutlined />}
        >Login</Button>
      {loginError && <span>{loginError}</span>}
    </>
  )
}

export default LoginButton;