import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
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
  informationCircleOutline
} from 'ionicons/icons';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { actions, RootState } from '../store';
import { Trans } from 'react-i18next';
import { Theme } from '../store/connections/types';
import ConnectionList from '../components/connections/ConnectionList';

type Props = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> &
{
}

const Menu: React.FunctionComponent<Props> = ({ connections, theme, setTheme, history }) => {

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
          <IonMenuToggle auto-hide="false">
          <IonItem button routerLink="/connect">
            <IonLabel><Trans>Connections</Trans></IonLabel>
          </IonItem>
        </IonMenuToggle>
        {/* <IonItemDivider key={'connectedDivider'}></IonItemDivider> */}
        <ConnectionList
            connections={connections}
            hidden={false}
            history={history}
          ></ConnectionList>
        <IonItemDivider key={'systemDivider'}></IonItemDivider>
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
  theme: state.connections.theme,  
  connections: state.connections.connections,
});

const mapDispatchToProps = {
  setTheme: (name: Theme) => actions.connection.setTheme(name)
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu));  