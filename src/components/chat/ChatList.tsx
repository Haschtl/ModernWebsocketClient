import React from 'react';
import { Message, Connection } from '../../store/connections/types';
import { IonList, IonContent, IonListHeader} from '@ionic/react';
import { Trans } from 'react-i18next';
import MessageBubbler from './Bubble';
// import { animateScroll } from "react-scroll";


interface Props {
  messages: Message[],
  connection: Connection
}


class ChatList extends React.Component<Props> {
  contentRef: React.RefObject<any> | null

  constructor(props: Props) {
    super(props);

    this.contentRef = React.createRef();
  }
  scrollToBottom() {
      // @ts-ignore
      this.contentRef.current.scrollToBottom();
  };

  componentDidMount() {
    this.scrollToBottom()
  }
  componentDidUpdate() {
    this.scrollToBottom()
  }
  render(){
    const messages = this.props.messages
  if (messages.length === 0) {
    return (
      <IonContent ref={this.contentRef} scrollEvents={true}>
      <IonList>
        <IonListHeader>
          <Trans>No messages found</Trans>
        </IonListHeader>
        <div id={'house'}></div>
      </IonList>
      {this.props.children}
      </IonContent>
    );
  }

  return (
    <IonContent ref={this.contentRef} scrollEvents={true}>
      <IonList>
    {messages.map((m: Message, idx:number) => (
      <MessageBubbler 
        connection={this.props.connection}
        message={m} 
        key={'msge'+idx}
        idx={idx} 
        >
      </MessageBubbler>
    ))}
    </IonList>
      {this.props.children}
    </IonContent>
  );
};}

export default ChatList;