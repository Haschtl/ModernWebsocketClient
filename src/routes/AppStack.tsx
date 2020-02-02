import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { RootState, actions } from '../store';

import Connect from '../pages/connection/Connect';
import Chat from '../pages/chat/Chat';
import { RouteComponentProps } from 'react-router';

import {
  analytics, logoGameControllerA,
} from 'ionicons/icons';
import { Trans } from 'react-i18next';

type AppStackProps = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

class AppStack extends React.Component<AppStackProps> {
  componentDidUpdate() {
    if (this.props.reducerHistory !== undefined) {
      this.props.history.push(this.props.reducerHistory)
      this.props.clearReducerHistory()
    }
  }

  render() {
    return (
      <IonPage>
        <IonTabs>
            <IonRouterOutlet animated={true}>
              <Route path="/connect" component={Connect} />
              <Route path="/chat" component={Chat} />
              <Route path="/" component={Connect} />
              {/* <Route path="/events/:id" component={EventDetail} /> */}
            </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="connect" href="/connect">
              <IonIcon icon={analytics} />
              <IonLabel><Trans>Connections</Trans></IonLabel>
            </IonTabButton>
              <IonTabButton tab="chat" href="/chat">
                <IonIcon icon={logoGameControllerA} />
                <IonLabel><Trans>Chat</Trans></IonLabel>
              </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonPage>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  reducerHistory: state.connections.history,
  // active: state.connections.active
});

const mapDispatchToProps = {
  clearReducerHistory: () => actions.connection.clearReducerHistory(),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppStack);
