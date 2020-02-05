import React from 'react';
import { Connection } from '../../store/connections/types';
import ConnectionListItem from './ConnectionListItem';
import { IonList, IonListHeader, IonText, IonCardContent, IonCard } from '@ionic/react';
import { Trans } from 'react-i18next';

interface Props {
  connections: Connection[]
  hidden: boolean;
  history: any;
}


const ConnectionList: React.FunctionComponent<Props> = ({ connections, hidden, children }) => {
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
        <IonText><Trans>This app works just like a normal "Chat"-App. Add a new "Contact" with "+" and start chatting with the Websocket Server</Trans></IonText>
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