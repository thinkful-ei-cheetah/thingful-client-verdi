import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ThingContext from '../../contexts/ThingContext'
import ThingApiService from '../../services/thing-api-service'
import { Hyph, Section } from '../../components/Utils/Utils'
import { ThingStarRating } from '../../components/ThingStarRating/ThingStarRating'
import ReviewForm from '../../components/ReviewForm/ReviewForm'
import { Redirect } from 'react-router-dom'

import './ThingPage.css'

export default class ThingPage extends Component {
  static defaultProps = {
    match: { params: {} },
  }

  static contextType = ThingContext

  async componentDidMount() {
    const { thingId } = this.props.match.params
    this.context.clearError()
    try {
      const thing = await ThingApiService.getThing(thingId)
      this.context.setThing(thing)

      const reviews = await ThingApiService.getThingReviews(thingId)
      this.context.setReviews(reviews)
    } catch(err){
      this.context.setError(err)
    }
  }

  componentWillUnmount() {
    this.context.clearThing()
    this.context.clearError()
  }

  renderThing() {
    const { thing, reviews } = this.context
    return <>
      <div className='ThingPage__image' style={{backgroundImage: `url(${thing.image})`}} />
      <h2>{thing.title}</h2>
      <ThingContent thing={thing} />
      <ThingReviews reviews={reviews} />
      <ReviewForm />
    </>
  }

  render() {
    const { error, thing } = this.context
    const {location} = this.props;

    if (error && error.error.startsWith('Session expired')){
      return <Redirect push to={{
        pathname: '/login',
        state: { from: location.pathname, error: error.error }}}/>
    }

    let content
    if (error) {
      content = <p className='red'>{error.error}</p>
    } else if (!thing.id) {
      content = <div className='loading' />
    } else {
      content = this.renderThing()
    }
    return (
      <Section className='ThingPage'>
        {content}
      </Section>
    )
  }
}

function ThingContent({ thing }) {
  return (
    <p className='ThingPage__content'>
      {thing.content}
    </p>
  )
}

function ThingReviews({ reviews = [] }) {
  return (
    <ul className='ThingPage__review-list'>
      {reviews.map(review =>
        <li key={review.id} className='ThingPage__review'>
          <p className='ThingPage__review-text'>
            <FontAwesomeIcon
              size='lg'
              icon='quote-left'
              className='ThingPage__review-icon blue'
            />
            {review.text}
          </p>
          <p className='ThingPage__review-user'>
            <ThingStarRating rating={review.rating} />
            <Hyph />
            {review.user.full_name}
          </p>
        </li>
      )}
    </ul>
  )
}
