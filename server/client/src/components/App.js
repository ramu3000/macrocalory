import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';


import Dashboard from '../components/Dashboard';
import Header from './Header';
import MealNew from './MealNew';

const Landing = () => <h2>This is Landing!</h2>;

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
    this.props.chooseDate(Date.now());
  }

  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            <Route exact={true} path="/" component={Landing} />
            <Route exact={true} path="/dashboard" component={Dashboard} />
            <Route exact={true} path="/food/new" component={MealNew} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);