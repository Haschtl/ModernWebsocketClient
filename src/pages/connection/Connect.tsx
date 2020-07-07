import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonPage,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonToolbar,
  IonTitle,
  IonAlert,
  IonItem,
  IonLabel
} from '@ionic/react';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { actions, RootState } from '../../store';
import { Connection } from '../../store/connections/types';
import { } from '@ionic/react';
import ConnectionList from '../../components/connections/ConnectionList';
import * as cogoToast from '../../components/CustomToasts';
import { add } from 'ionicons/icons';

import { Trans } from 'react-i18next';
import { withTranslation, WithTranslation } from 'react-i18next';

type Props = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  showCreateNewAlert: boolean;
};


class Connect extends PureComponent<Props & WithTranslation, State> {
  state = {
    showCreateNewAlert: false
  };

  addNewConnection(data: any) {
    // const { t } = this.props;
    if (data.name === '') {
      cogoToast.error(this.props.t('You need to specify a name'))
      return
    }
    if (data.host === '') {
      cogoToast.error(this.props.t('You need to specify a hostadress'))
      return
    }
    if (data.host.startsWith("ws://") === true) {
      // cogoToast.error(this.props.t('The hostname must not contain "ws://". SSL or not can be configured afterwards and is automatically enabled on port 443.'))
      // return
      data.host = data.host.replace("ws://","")
    }
    if (data.host.startsWith("wss://") === true) {
      // cogoToast.error(this.props.t('The hostname must not contain "wss://". SSL or not can be configured afterwards and is automatically enabled on port 443.'))
      // return
      data.host = data.host.replace("wss://","")
    }
    if (data.host.startsWith("http://") === true) {
      // cogoToast.error(this.props.t('The hostname must not contain "http://". SSL or not can be configured afterwards and is automatically enabled on port 443.'))
      // return
      data.host = data.host.replace("http://","")
    }
    if (data.host.startsWith("https://") === true) {
      // cogoToast.error(this.props.t('The hostname must not contain "https://". SSL or not can be configured afterwards and is automatically enabled on port 443.'))
      // return
      data.host = data.host.replace("https://","")
    }
    if (data.host.startsWith("ftp://") === true) {
      cogoToast.error(this.props.t('The hostname must not contain "ftp://". FTP is a different protocol...'))
      return
    }
    
    var useSSL = false
    if (data.ssl) {
      useSSL = true
    }
    if (Number(data.port) === 443) {
      useSSL = true
    }
    const connect: Connection = { 
      name: data.name, 
      host: data.host, 
      port: data.port, 
      beautify: false, 
      password: "", 
      timeout: 5, 
      commands: [], 
      connected: false, 
      info: '', 
      id: 0, 
      ssl: useSSL, 
      autoconnect: false, 
      messages:[] , 
      binaryOffset:0, 
      binaryType:"int8",
      sec_websocket_protocol: "",
      ba_password: "",
      ba_username: "",
    }
    this.props.addConnection(connect)
    this.props.saveConnections(this.props.connections)
  }

  render() {

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle><Trans>WebsocketClient</Trans></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <ConnectionList
            connections={this.props.connections}
            hidden={false}
            history={this.props.history}
          >
            <IonItem style={{ textAlign: 'center' }} button detail={false} onClick={() => this.setState(() => ({ showCreateNewAlert: true }))}>
              <IonLabel style={{}}>
                <IonIcon icon={add} />&nbsp;
              <Trans>Add Websocket Server</Trans>
              </IonLabel>
            </IonItem>
          </ConnectionList>
        </IonContent>
        <IonAlert
          isOpen={this.state.showCreateNewAlert}
          onDidDismiss={() => this.setState(() => ({ showCreateNewAlert: false }))}
          header={this.props.t('Add new connection')}
          // subHeader={this.props.t('Enter a hostname without "ws://" or "wss://".')}
          inputs={[
            {
              label: this.props.t('Name'),
              name: 'name',
              type: 'text',
              placeholder: this.props.t('Name'),
            },
            {
              label: this.props.t('Hostname (w.o. wss:// or ws://)'),
              name: 'host',
              type: 'text',
              id: 'hostId',
              placeholder: this.props.t('Host (echo.websocket.org)'),
            },
            {
              label: this.props.t('Port'),
              name: 'port',
              type: 'number',
              id: 'portId',
              value: 443,
              placeholder: this.props.t('443'),
            },
          ]}
          buttons={[
            {
              text: this.props.t('Cancel'),
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
              }
            },
            {
              text: this.props.t('Add'),
              handler: (alertData) => {
                this.addNewConnection(alertData)
              }
            }
          ]}
        />
        <IonFab vertical="bottom" horizontal="end" slot="fixed" color="dark">
          <IonFabButton onClick={() => this.setState(() => ({ showCreateNewAlert: true }))}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonPage>
    );
  };
}

const mapStateToProps = (state: RootState) => ({
  connections: state.connections.connections,
});

const mapDispatchToProps = {
  addConnection: (connection: Connection) => actions.connection.addConnection(connection),
  saveConnections: (connections: Connection[]) => actions.connection.saveConnections(connections),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Connect));
