import React, { Component } from 'react'
import { Button, Input } from '../Utils/Utils'
import TokenService from '../../services/token-service';
import AuthApiService from '../../services/auth-api-service';
import ThingContext from '../../contexts/ThingContext';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

export default class LoginForm extends Component {
  static defaultProps = {
    onLoginSuccess: () => {}
  }

  static contextType = ThingContext;

  state = { error: this.context.error ? this.context.error.error : null }


  handleSubmitBasicAuth = async ev => {
    ev.preventDefault()
    const { user_name, password } = ev.target
    this.setState({error: null})
    
    try {
      const res = await AuthApiService.login(user_name.value, password.value)
      TokenService.saveAuthToken(res.authToken);

      user_name.value = ''
      password.value = ''
      this.props.onLoginSuccess()
    } catch(error){
      this.setState({error: error.error})
    }
  }

  responseGoogle = async (response) => {
    console.log(response.tokenObj)
    if (!response.tokenObj) {
      this.setState({error: 'invalid login attempt'})
    } else {
      try {
        const res = await AuthApiService.loginGoogle(response.tokenObj)
        TokenService.saveAuthToken(res.authToken);
        
        this.props.onLoginSuccess()
      } catch(err){
        this.setState({error: err.error})
      }
    }
  }

  responseFacebook = async (response) => {
    console.log(response);
    if (!response.accessToken) {
      this.setState({error: 'invalid login attempt'})
    } else {
      try {
        const res = await AuthApiService.loginFacebook(response)
        TokenService.saveAuthToken(res.authToken);
        
        this.props.onLoginSuccess()
      } catch(err){
        this.setState({error: err.error})
      }
    }
  }

  render() {
    const { error } = this.state

    return (
      <div>
        <form
          className='LoginForm'
          onSubmit={this.handleSubmitBasicAuth}
        >
          <div role='alert'>
            {error && <p className='red'>{error}</p>}
          </div>
          <div className='user_name'>
            <label htmlFor='LoginForm__user_name'>
              User name
            </label>
            <Input
              required
              name='user_name'
              id='LoginForm__user_name'>
            </Input>
          </div>
          <div className='password'>
            <label htmlFor='LoginForm__password'>
              Password
            </label>
            <Input
              required
              name='password'
              type='password'
              id='LoginForm__password'>
            </Input>
          </div>
          <Button type='submit'>
            Login
          </Button>
        </form>

        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy={'single_host_origin'}
        />


      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        fields="name,email,picture"
        callback={this.responseFacebook}
        icon="fa-facebook"
      />

      </div>
    )
  }
}