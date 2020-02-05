import React from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { withRouter, RouteComponentProps } from 'react-router';
import { IonLabel, IonItemSliding, IonIcon, IonItem, IonRippleEffect, IonNote, IonBadge, IonItemOptions, IonItemOption, IonAlert } from '@ionic/react';
import { Connection } from '../../store/connections/types';
import { AlertButton } from '@ionic/react';
import { Trans } from 'react-i18next';
import { withTranslation, WithTranslation } from 'react-i18next';

import {
  trash,
} from 'ionicons/icons';

type Props = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> & {
  connection: Connection;
  id: number;
}

type State = {
  showAlert: boolean;
  alertHeader?: string;
  alertMessage?: string;
  alertButtons: (AlertButton | string)[];
  isDeleted: boolean
}

class ConnectionListItem extends React.PureComponent<Props & WithTranslation, State> {
  ionItemSlidingRef: React.RefObject<any>
  defaultState: State = {
    showAlert: false,
    alertHeader: '',
    alertMessage: undefined,
    alertButtons: [],
    isDeleted: false
  }

  constructor(props: Props & WithTranslation) {
    super(props);

    this.state = {
      ...this.defaultState
    };
    this.ionItemSlidingRef = React.createRef();
  }

  componentDidUpdate() {
    if (this.props.reducerHistory !== undefined) {
      this.props.history.push(this.props.reducerHistory)
      this.props.clearReducerHistory()
    }
  }

  dismissAlert = () => {
    try {
      this.setState(() => ({
        ...this.defaultState
      }));
      this.ionItemSlidingRef.current.close();
    }
    catch { }
  }

  removeConnection = (title: string) => () => {
    this.setState({
      showAlert: true,
      alertHeader: title,
      alertMessage: this.props.t('Would you like to remove this connection?'),
      alertButtons: [
        {
          text: this.props.t('Cancel'),
          handler: this.dismissAlert
        },
        {
          text: this.props.t('Remove'),
          handler: () => {
            this.props.removeConnection(this.props.connection);
            this.props.saveConnections(this.props.connections)
          }
        }
      ]
    });
  }

  // establishConnection(connection: Connection) {
  //   this.props.establishConnection(connection)
  // }

  // quitConnection(connection: Connection) {
  //   this.props.quitConnection(connection)
  //   this.dismissAlert()
  // }

  render() {
    const connection = this.props.connection;
    return (
      <IonItemSliding ref={this.ionItemSlidingRef} class={'name-' + connection.host}>
        <IonAlert
          isOpen={this.state.showAlert}
          header={this.state.alertHeader}
          buttons={this.state.alertButtons}
          onDidDismiss={this.dismissAlert}
        ></IonAlert>
        <IonItem button detail={true} routerLink={'/chat/'+connection.id}>
          <IonLabel>
            <h1>{connection.name}</h1>
            <IonNote>{connection.host + ':' + connection.port}
            </IonNote>

            {/* <p>
            <IonChip style={{fontSize: "small"}} slot="end">
                  <IonLabel color={(connection.ssl ? "success" : "danger")}><Trans>SSL</Trans></IonLabel>
            </IonChip>
            </p> */}
            
          </IonLabel>
            <IonBadge color={(connection.ssl ? "success" : "danger")} slot="end">
              <Trans>SSL</Trans>
          </IonBadge>
          {!connection.connected === false &&
            <IonBadge color="success" slot="end">
              <Trans>Online</Trans>
          </IonBadge>
          }
        </IonItem>
        <IonItemOptions onIonSwipe={this.removeConnection(connection.name + this.props.t(' will be removed'))}>
          <IonItemOption color="danger" onClick={this.removeConnection(connection.name + this.props.t(' will be removed'))} expandable={true}>
            <IonIcon icon={trash}></IonIcon>
          </IonItemOption>
        </IonItemOptions>
        {/* {connection.connected === false ?
          <IonItemOptions side="start" onIonSwipe={() => this.establishConnection(connection)}>
            <IonItemOption color="secondary" onClick={() => this.establishConnection(connection)} expandable={true}>
              <Trans>Connect</Trans>
          </IonItemOption>
          </IonItemOptions>
          :
          <IonItemOptions side="start" onIonSwipe={() => this.quitConnection(connection)}>

            <IonItemOption color="primary" onClick={() => this.quitConnection(connection)} expandable={true}>
            <Trans>Disconnect</Trans>
          </IonItemOption>
          </IonItemOptions>
        } */}
        <IonRippleEffect></IonRippleEffect>
      </IonItemSliding>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  connections: state.connections.connections,
  reducerHistory: state.connections.history
});

const mapDispatchToProps = {
  removeConnection: (connection: Connection) => actions.connection.removeConnection(connection),
  saveConnections: (connections: Connection[]) => actions.connection.saveConnections(connections),
  // establishConnection: (connection: Connection) => actions.connection.establishConnection(connection),
  // quitConnection: (connection: Connection) => actions.connection.quitConnection(connection),
  clearReducerHistory: () => actions.connection.clearReducerHistory(),
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ConnectionListItem)));
