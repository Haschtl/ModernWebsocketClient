import {
  IonButtons,
  IonButton,
  IonContent,
  IonPage,
  IonHeader,
  IonMenuButton,
  IonToolbar,
  IonTitle,
  IonGrid, IonRow, IonCol,
  IonImg,
  IonCard,
  IonText,
  IonCardContent,
  IonLabel
} from '@ionic/react';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../store';
import { Plugins, FilesystemDirectory, FilesystemEncoding  } from '@capacitor/core';
import { Trans } from 'react-i18next';
import * as cogoToast from '../components/CustomToasts';
import { withTranslation, WithTranslation } from 'react-i18next';

const { Browser,
  Share, Filesystem } = Plugins;


type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> & {
};

class AboutPage extends PureComponent<Props & WithTranslation> {
  share = () => {
    Share.share({
      title: this.props.t('WebsocketClient'),
      text: this.props.t("This Websocket Client is really amazing!"),
      url: 'https://haschtl.github.io/ModernWebsocketClient/',
      dialogTitle: this.props.t('Share this App with buddies')
    })
  }

  importConnections = () => {
    this.props.importConnections()
  }

  exportConnections = () => {
    const path = 'External/WebsocketClient.json'
    const data = JSON.stringify(this.props.connections)
    try {
      Filesystem.writeFile({
        path: 'WebsocketClient.json',
        data: data,
        directory: FilesystemDirectory.ExternalStorage,
        encoding: FilesystemEncoding.UTF8
      });
      cogoToast.success(this.props.t('Config-file has been saved to ')+path)
    } catch (e) {
      console.error('Unable to write file', e);
      cogoToast.error(this.props.t('Unable to save config-file to ')+path)
    }
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle><Trans>About</Trans></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonGrid>
            <IonRow>
              <IonCol align-self-center>
                <IonLabel>
                  WebsocketClient<IonText> v{this.props.version}</IonText>
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow align-self-center>
              <IonCol align-self-center>
                <IonImg src="assets/icon/favicon.png" style={{ width: "30%" }}></IonImg>                </IonCol>
            </IonRow>
          </IonGrid>
          <IonCard><IonCardContent>
            <IonText><Trans>This is a OpenSource Websocket Client App with SSL support</Trans> v{this.props.version}<br></br>
              <Trans>It's written in Typescript using Ionic4 with React</Trans>
            </IonText>
          </IonCardContent>
          </IonCard>
          <IonButton expand="full" fill="solid" color="secondary" onClick={this.share}>
            <Trans>Share</Trans>
          </IonButton>
          <IonButton expand="full" fill="solid" color="danger" onClick={() => Browser.open({ url: 'https://www.paypal.com/donate/?token=ECCLajboRrJcPTW0AvKLtiw114LrXmBEpAy0y3AWQEZfz0u2ZXFbN63lxjFceNOSqu2YQW&country.x=DE&locale.x=DE' })}>
            <Trans>Donate</Trans>
          </IonButton>
          <IonButton expand="full" fill="solid" color="tertiary" onClick={() => Browser.open({ url: 'https://haschtl.github.io/ModernWebsocketClient/' })}>
            <Trans>Github Page</Trans>
          </IonButton>
          <IonButton expand="full" fill="solid" color="tertiary" onClick={() => Browser.open({ url: 'https://haschtl.github.io/RealTimeOpenControl/' })}>
            <Trans>Compatible Tools</Trans>
          </IonButton>      
          <IonButton expand="full" fill="solid" color="primary" onClick={() => this.exportConnections()}>
            <Trans>Export App settings</Trans>
          </IonButton>
          <IonButton expand="full" fill="solid" color="primary" onClick={() => this.importConnections()}>
            <Trans>Import App settings</Trans>
          </IonButton>  
          </IonContent>
      </IonPage>
    );
  };
}

const mapStateToProps = (state: RootState) => ({
  connections: state.connections.connections,
  version: state.connections.version,
});

const mapDispatchToProps = {
  importConnections: () => actions.connection.importConnections(),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AboutPage));
