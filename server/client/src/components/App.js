import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';

import DashboardComponent from '../components/Dashboard';
import Header from './Header';
import MealNewComponent from './MealNew';
import Landing from './Landing';

const LoadingSpinner = () => <h2>Checking authentication...</h2>;

const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/',
  authenticatedSelector: state => state.auth.data !== '',
  wrapperDisplayName: 'UserIsAuthenticated',
  // Returns true if the user auth state is loading
  authenticatingSelector: state => state.auth.isLoading,
  // Render this component when the authenticatingSelector returns true
  AuthenticatingComponent: LoadingSpinner
});

const Dashboard = userIsAuthenticated(DashboardComponent);
const MealNew = userIsAuthenticated(MealNewComponent);

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  isLoggedIn() {
    if (this.props.auth === null) {
      return false;
    } else if (this.props.auth === false) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/food/new" component={MealNew} />
              <Route path="/" render={() => <Redirect to="/" />} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

function mapsStateToProps({ auth }) {
  return { auth };
}
export default connect(mapsStateToProps, actions)(App);
