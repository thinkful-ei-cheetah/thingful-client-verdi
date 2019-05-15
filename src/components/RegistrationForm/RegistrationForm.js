import React, { Component } from 'react'
import { Button, Input, Required } from '../Utils/Utils'
import AuthApiService from '../../services/auth-api-service';

export default class RegistrationForm extends Component {
  static defaultProps = {
    onRegistrationSuccess: () => {}
  }

  state = { error: null }

  handleSubmit = async ev => {
    ev.preventDefault()
    const { full_name, nickname, user_name, password } = ev.target
    const userData = {full_name, nickname, user_name, password}

    try {
      const savedUser = await AuthApiService.createUser(userData)
      console.log(savedUser)
      full_name.value = ''
      nickname.value = ''
      user_name.value = ''
      password.value = ''
      this.props.onRegistrationSuccess()
    } catch(err) {
      this.setState({error: err.error})
    }
    
  }

  render() {
    const { error } = this.state
    return (
      <form
        className='RegistrationForm'
        onSubmit={this.handleSubmit}
      >
        <div role='alert'>
          {error && <p className='red'>{error}</p>}
        </div>
        <div className='full_name'>
          <label htmlFor='RegistrationForm__full_name'>
            Full name <Required />
          </label>
          <Input
            name='full_name'
            type='text'
            required
            id='RegistrationForm__full_name'>
          </Input>
        </div>
        <div className='user_name'>
          <label htmlFor='RegistrationForm__user_name'>
            User name <Required />
          </label>
          <Input
            name='user_name'
            type='text'
            required
            id='RegistrationForm__user_name'>
          </Input>
        </div>
        <div className='password'>
          <label htmlFor='RegistrationForm__password'>
            Password <Required />
          </label>
          <Input
            name='password'
            type='password'
            required
            id='RegistrationForm__password'>
          </Input>
        </div>
        <div className='nickname'>
          <label htmlFor='RegistrationForm__nickname'>
            Nickname
          </label>
          <Input
            name='nickname'
            type='text'
            required
            id='RegistrationForm__nickname'>
          </Input>
        </div>
        <Button type='submit'>
          Register
        </Button>
      </form>
    )
  }
}
