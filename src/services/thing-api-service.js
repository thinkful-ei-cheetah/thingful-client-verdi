import config from '../config'
import TokenService from './token-service';

const ThingApiService = {
  getThings() {
    return fetch(`${config.API_ENDPOINT}/things`, {
      headers: {
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  getThing(thingId) {
    return fetch(`${config.API_ENDPOINT}/things/${thingId}`, {
      headers: {
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(e => {
            if (e.error.startsWith('Session expired')) {
              TokenService.clearAuthToken();
            }
            return Promise.reject(e)
          })
        }
          
        return res.json()
      })
  },
  getThingReviews(thingId) {
    return fetch(`${config.API_ENDPOINT}/things/${thingId}/reviews`, {
      headers: {
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(e => {
          if (e.error.startsWith('Session expired')) {
            TokenService.clearAuthToken();
          }
          return Promise.reject(e)
        })
      }
        
      return res.json()
    })
  },
  postReview(thingId, text, rating) {
    return fetch(`${config.API_ENDPOINT}/reviews`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({
        thing_id: thingId,
        rating,
        text,
      }),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(e => {
          if (e.error.startsWith('Session expired')) {
            TokenService.clearAuthToken();
          }
          return Promise.reject(e)
        })
      }
        
      return res.json()
    })
  }
}

export default ThingApiService
