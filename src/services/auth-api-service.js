import config from '../config';

const AuthApiService = {
  async login(user_name, password){
    const loginData = {user_name, password};
    const res = await fetch(`${config.API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })

    if (!res.ok) {
      return res.json().then(e => Promise.reject(e))
    }
    return res.json();
  }
}

export default AuthApiService;