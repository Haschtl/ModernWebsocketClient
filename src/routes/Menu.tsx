import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
  IonImg,
  IonThumbnail,
  IonButtons,
  IonButton,
  IonSelect, IonSelectOption
} from '@ionic/react';
import {
  wifi,
  analytics,
  helpCircleOutline,
  informationCircleOutline
} from 'ionicons/icons';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { actions, RootState } from '../store';
import { Trans } from 'react-i18next';
import { Theme } from '../store/connections/types';

const routes = {
  appPages: [
    { title: <Trans key="conn">Websocket</Trans>, path: '/connect', icon: wifi }
  ],
  simplePages: [
    { title: <Trans key="sig1">Chat</Trans>, path: '/chat', icon: analytics },
  ]
};


type Props = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> &
{
  accesslevel: 'expert' | 'simple';
  title?: string | JSX.Element;
}

const Menu: React.FunctionComponent<Props> = ({ title, theme, setTheme }) => {

  function renderlistItems(list: any[], key: string = 'default') {
    return list
      .filter(route => !!route.path)
      .map((p:any, idx:number) => (
        <IonMenuToggle key={p.path + key+idx} auto-hide="false">
          <IonItem button key={p.path + key+idx} routerLink={p.path}>
            <IonIcon slot="start" icon={p.icon} />
            <IonLabel>{p.title}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  return (
    <IonMenu contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonThumbnail slot="start">
            <IonImg src="assets/icon/favicon.png"></IonImg>
          </IonThumbnail>
          <IonTitle><Trans>Menu</Trans></IonTitle>
          <IonButtons slot="end">
            <IonMenuToggle key={'tutbutton'} auto-hide="false" > 
            <IonButton routerLink={'/tutorial'}>
            
              <IonIcon icon={helpCircleOutline} ></IonIcon>
            </IonButton>
              </IonMenuToggle>
              <IonMenuToggle key={'aboutbutton'} auto-hide="false" > 

            <IonButton routerLink={'/about'}>
              <IonIcon icon={informationCircleOutline}></IonIcon>
            </IonButton>
            </IonMenuToggle>

          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="outer-content">
        <IonList key="appPages">
          <IonListHeader><Trans>Connections</Trans></IonListHeader>
          {renderlistItems(routes.appPages, 'appPages')}
        </IonList>
        <IonItemDivider key={'connectedDivider'}></IonItemDivider>
          {title !== undefined && 
        <><IonList key="connectedPages">
          <IonListHeader>{title}</IonListHeader>
          {renderlistItems(routes.simplePages, 'simple')}
        </IonList>

        <IonItemDivider key={'systemDivider'}></IonItemDivider></>
      }
        <IonList>
          <IonItem>
            <IonLabel><Trans>Theme</Trans></IonLabel>
            <IonSelect value={theme} onIonChange={(e: CustomEvent) => setTheme(e.detail.value)}

              interface="action-sheet"
              placeholder="No theme selected"
            >
              <IonSelectOption value="blackwhite-theme"><Trans>Black and White</Trans></IonSelectOption>
              <IonSelectOption value="oled-theme"><Trans>Black-OLED</Trans></IonSelectOption>
              <IonSelectOption value="dark-theme"><Trans>Dark</Trans></IonSelectOption>
              <IonSelectOption value="medium-theme"><Trans>Medium</Trans></IonSelectOption>
              <IonSelectOption value="light-theme"><Trans>Light</Trans></IonSelectOption>
              <IonSelectOption value="green-theme"><Trans>Green</Trans></IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

const mapStateToProps = (state: RootState) => ({
  userActions: state.connections.userActions,
  theme: state.connections.theme,
});

const mapDispatchToProps = {
  sendWebsocket: (message: string) => actions.connection.sendWebsocket(message),
  setTheme: (name: Theme) => actions.connection.setTheme(name)
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu));  