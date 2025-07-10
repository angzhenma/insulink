
const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

const cognito = new AWS.CognitoIdentityServiceProvider();
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  try {
    const response = await cognito.initiateAuth(params).promise();

    return res.status(200).json({
      message: 'Login successful',
      token: response.AuthenticationResult.IdToken,
      accessToken: response.AuthenticationResult.AccessToken,
      refreshToken: response.AuthenticationResult.RefreshToken
    });
  } catch (error) {
    console.error('Cognito login error:', error);
    return res.status(401).json({ error: 'Invalid email or password' });
  }
});

module.exports = router;