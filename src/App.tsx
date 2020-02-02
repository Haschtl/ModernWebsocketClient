
import React, { Component } from 'react';
import {
  Route, Switch
} from 'react-router-dom';
import {
  IonApp,
  IonSplitPane, IonPage, IonButton, IonModal, IonImg,
  IonHeader, IonLabel, IonToolbar, IonTitle,
  IonMenu, IonContent, IonItem, IonText
  // IonItem, IonList
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// import Connect from './pages/connection/Connect';
import ConnectionDetail from './pages/connection/ConnectionDetail';
import TutorialDetail from './pages/tutorial/TutorialDetail';
import {Command} from './store/connections/types';

import AppStack from './routes/AppStack';
import TutorialPage from './pages/tutorial/TutorialPage';
import AboutPage from './pages/AboutPage';
import Menu from './routes/Menu';

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

import { Trans } from 'react-i18next';

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
              <Menu key={'mainmenu'}
                accesslevel={this.props.active !== undefined ? this.props.active.accesslevel : 'simple'}
                title={this.props.active !== undefined ? this.props.active.name : undefined}
              />

              {/* {this.state.bigscreen && */}
              <IonMenu contentId="main" side="end">

                <IonContent>
                  {this.state.bigscreen ?
                    <Switch>
                      <Route path="/connect/:id" component={ConnectionDetail} />
                      <Route path="/tutorial/:id" component={TutorialDetail} />
                    </Switch>
                    :
                    this.props.active === undefined ?
                    <IonLabel><Trans>Not connected</Trans></IonLabel>
                    :
                    this.props.active.commands.map((c: Command, idx:number) => (
                      <IonItem key={'recoMenu'+idx}>
  <IonText>{c.value}</IonText>
  <IonLabel>{c.num}</IonLabel>
                      </IonItem>
                    ))
                    }
                  
                </IonContent>
              </IonMenu>

              <IonPage id="main">
                <IonModal
                  isOpen={this.props.actionPicture !== undefined}
                  onDidDismiss={() => this.props.deleteActionPicture()
                  }>
                  <IonHeader>
                    <IonToolbar>
                      <IonTitle><Trans>Picture received</Trans></IonTitle>
                      <IonButton slot='end' onClick={() => this.props.deleteActionPicture()}><Trans>Dismiss</Trans></IonButton>
                    </IonToolbar>
                  </IonHeader>
                  <IonImg src={"data:image/png;base64," + this.props.actionPicture} style={{ width: "100%", height: "100%" }}></IonImg>
                  <IonButton onClick={() => this.props.deleteActionPicture()}><Trans>Dismiss</Trans></IonButton>
                </IonModal>
                {this.props.active !== undefined ?
                  this.state.bigscreen ?
                    <Switch>
                      <Route path="/connect" component={AppStack} />
                      <Route path="/chat" component={AppStack} />
                      <Route path="/about" component={AboutPage} />
                      <Route path="/tutorial" component={TutorialPage} />
                      <Route path="/" component={AppStack} />
                    </Switch>
                    :
                    <Switch>
                      <Route path="/connect/:id" component={ConnectionDetail} />
                      <Route path="/tutorial/:id" component={TutorialDetail} />
                      <Route path="/connect" component={AppStack} />
                      <Route path="/chat" component={AppStack} />
                      <Route path="/about" component={AboutPage} />
                      <Route path="/tutorial" component={TutorialPage} />
                      <Route path="/" component={AppStack} />
                    </Switch>
                  :
                  this.state.bigscreen ?
                    <Switch>
                      <Route path="/about" component={AboutPage} />
                      <Route path="/connect" component={AppStack} />
                      <Route path="/tutorial" component={TutorialPage} />
                      <Route path="/" component={AppStack} />
                    </Switch>
                    :
                    <Switch>
                      <Route path="/connect/:id" component={ConnectionDetail} />
                      <Route path="/tutorial/:id" component={TutorialDetail} />
                      <Route path="/about" component={AboutPage} />
                      <Route path="/connect" component={AppStack} />
                      <Route path="/tutorial" component={TutorialPage} />
                      <Route path="/" component={AppStack} />
                    </Switch>
                }
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
  deleteActionPicture: () => actions.connection.deleteActionPicture(),
};

const mapStateToProps = (state: RootState) => ({
  active: state.connections.active,
  actionPicture: state.connections.actionPicture,
  theme: state.connections.theme,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);