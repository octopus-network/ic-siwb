import React from 'react';
import { Alert, Button, Space } from 'antd';
import { useSiwbIdentity } from 'ic-siwb-lasereyes-connector';

export default function IdentityExpiredAlert() {
  const { isIdentityExpired, isLoggingIn, login, connectedBtcAddress } = useSiwbIdentity();

  if (!isIdentityExpired) {
    return null;
  }

  const handleReLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Manual re-login failed:', error);
    }
  };

  return (
    <Alert
      message="Identity Expired"
      description={
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <span>
            {connectedBtcAddress
              ? 'Your identity has expired. Please reconnect your wallet and sign in again. You can also click the button below to manually re-login.'
              : 'Your identity has expired. Please connect your wallet and sign in again.'}
          </span>
          {connectedBtcAddress && (
            <Button
              type="primary"
              size="small"
              onClick={handleReLogin}
              loading={isLoggingIn}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Re-logging in...' : 'Re-login'}
            </Button>
          )}
        </Space>
      }
      type="warning"
      showIcon
      closable
      style={{ marginBottom: 16 }}
    />
  );
}

