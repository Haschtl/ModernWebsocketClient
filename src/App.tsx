
import React, { Component } from 'react';
import {
  Route, Switch
} from 'react-router-dom';
import {
  IonApp,
  IonSplitPane, IonPage,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ConnectionDetail from './pages/connection/ConnectionDetail';
import AboutPage from './pages/AboutPage';
import Menu from './routes/Menu';

import Connect from './pages/connection/Connect';
import Chat from './pages/chat/Chat';
// import { withNamespaces } from 'react-i18next';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/darktheme.css';
import './theme/oledtheme.css';
import './theme/mediumtheme.css';
import './theme/green.css';
import './theme/blacknwhitetheme.css';

import {
  setupConfig
} from '@ionic/core';
// import { Plugins, StatusBarStyle } from '@capacitor/core';

import { actions, RootState } from './store';
import { connect } from 'react-redux';


setupConfig({
  rippleEffect: true,
  // mode: 'md',
  hardwareBackButton: true,
  swipeBackEnabled: true,
  animated: true,
});

type AppState = {
  bigscreen: boolean
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

class App extends Component<Props, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      bigscreen: false
    };
  }

  componentDidMount() {
    this.props.loadTheme()
    this.props.loadConnections()
  }

  toggleBigscreen(e: CustomEvent) {
    this.setState({ ...this.state, bigscreen: e.detail.visible })
  }

  render() {
    return (
      <div className={this.props.theme}>
        <IonApp>
          <IonReactRouter>

            <IonSplitPane
              contentId="main"
              onIonSplitPaneVisible={(e: CustomEvent) => this.toggleBigscreen(e)}
            >
              <Menu/>

              <IonPage id="main">
                  <Switch>
                    <Route path="/connect/:id" component={ConnectionDetail} />
                    <Route path="/connect" component={Connect} />
                    <Route path="/chat/:id" component={Chat} />
                    <Route path="/about" component={AboutPage} />
                    <Route path="/" component={Connect} />
                  </Switch>
              </IonPage>
            </IonSplitPane>
          </IonReactRouter>
        </IonApp>
      </div>
    );
  }
}


const mapDispatchToProps = {
  loadTheme: () => actions.connection.loadTheme(),
  loadConnections: () => actions.connection.loadConnections(),
};

const mapStateToProps = (state: RootState) => ({
  theme: state.connections.theme,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);