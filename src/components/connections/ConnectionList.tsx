import React from 'react';
import { Connection } from '../../store/connections/types';
import ConnectionListItem from './ConnectionListItem';
import { IonList, IonListHeader, IonText, IonCardContent, IonCard, IonButton } from '@ionic/react';
import { Trans } from 'react-i18next';

interface Props {
  connections: Connection[]
  hidden: boolean;
  history: any;
}


const ConnectionList: React.FunctionComponent<Props> = ({ connections, hidden, history, children }) => {
  if (connections.length === 0) {
    return (
      <>
      <IonList style={hidden ? { display: 'none' } : {}}>
        <IonListHeader>
          <Trans>No connections Found</Trans>
        </IonListHeader>
        
      {children}
      </IonList>

      <IonCard>
        <IonCardContent>
        <IonText><Trans>Seems that you are using this Websocket Client for the first time.</Trans></IonText><br />
        <IonText><Trans>To learn how to use this app, have a look into the tutorial</Trans></IonText><br />
        <IonButton fill="outline" color="tertiary" routerLink={'/tutorial'}>
          <Trans>Show tutorial</Trans>
        </IonButton>
        </IonCardContent>
      </IonCard>
      </>
    );
  }

  return (
    <IonList style={hidden ? { display: 'none' } : {}}>
      {connections.map((connection: Connection, connectionIndex: number) => (
        <ConnectionListItem
          key={`c-${connectionIndex}`}
          connection={connection}
          id={connection.id}
        />
      ))}
      {children}
    </IonList>
  );
};

export default ConnectionList;