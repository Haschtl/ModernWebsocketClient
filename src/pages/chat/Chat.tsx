import {
  IonButtons,
  IonContent,
  IonPage,
  IonHeader,
  IonMenuButton,
  IonToolbar,
  IonFooter,
  IonTitle,
  IonIcon,
  IonButton,
  IonItem, IonList, IonLabel
} from '@ionic/react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { actions, RootState, selectors } from '../../store';
import { Command, Connection } from '../../store/connections/types';
import ChatList from '../../components/chat/ChatList'
import { } from '@ionic/react';

import { Trans } from 'react-i18next';
import { withTranslation, WithTranslation } from 'react-i18next';

import {
  send,
} from 'ionicons/icons';


type Props = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  textinput: string;
};


class Chat extends Component<Props & WithTranslation, State> {
  state = {
    textinput: ''
  };

  onSubmit(e: React.FormEvent) {
    e.preventDefault()
    this.onSubmit2()
  }
  onSubmit2() {
    this.setState({ textinput: "" });
    this.props.sendWebsocket(this.state.textinput);
    if(this.props.active===undefined){return}
    this.props.saveConnections(this.props.connections, this.props.active)
  }
  onChange(e: any) {
    this.setState({ textinput: e.target.value });
  }

  clearMessages() {
    this.props.clearMessages();
  }

  filterCommands(commands: Command[], searchtext: string, count: number){
    return commands.filter(comm2 => comm2.value.toLowerCase() !== searchtext.toLowerCase()).filter(comm => comm.value.toLowerCase().indexOf(searchtext.toLowerCase())!==-1).sort((a, b) => (
      b.num - a.num
    )).slice(0,count).reverse()
  }

  render() {
    if (this.props.active === undefined) {
      return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle><Trans>Not connected</Trans></IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent></IonContent>
        </IonPage>
      )
    }

    var text = this.state.textinput
    if (this.props.chatInput !== undefined) {
      this.setState({ ...this.state, textinput: this.props.chatInput })
      text = this.props.chatInput
      this.props.setChatInput(undefined)
    }
    const commands = this.filterCommands(this.props.active.commands, text, 3);

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{this.props.active.name}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => { this.clearMessages() }}><Trans>Clear</Trans></IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <ChatList
            messages={this.props.allMessages}
          ></ChatList>
        </IonContent>
        <IonFooter className="Footer" style={{ "backgroundColor": "transparent" }}>
          {(this.state.textinput.length > 0 && commands.length>0) &&

            <IonList color='secondary'>
              {commands.map((c: Command, idx: number) => (
                <IonItem key={'recom' + idx} onClick={() => this.props.setChatInput(c.value)}>
                  <IonLabel>{c.value}</IonLabel>
                  {/* <IonLabel>{c.num}</IonLabel> */}
                </IonItem>
              ))}
            </IonList>
          }
          <div className="Input">
            <form onSubmit={e => this.onSubmit(e)}>
              <input
                onChange={e => this.onChange(e)}
                value={text}
                type="text"
                placeholder={this.props.t("Enter your message and press ENTER")}
              />
              <IonButton onClick={e => this.onSubmit2()}><IonIcon icon={send}></IonIcon></IonButton>
            </form>
          </div>
        </IonFooter>
      </IonPage>
    );
  };

  updateState(event: any, key: string) {
    this.setState({ ...this.state, [key]: event.target.value })
  }

}
const mapStateToProps = (state: RootState) => ({
  active: state.connections.active,
  connections: state.connections.connections,
  allMessages: selectors.connection.all(state.connections),
  messages: state.connections.messages,
  chatInput: state.connections.chatInput
});

const mapDispatchToProps = {
  sendWebsocket: (message: string) => actions.connection.sendWebsocket(message),
  clearMessages: () => actions.connection.clearMessages(),
  setChatInput: (text: string | undefined) => actions.connection.setChatInput(text),  
  saveConnections: (connections: Connection[], active: Connection) => actions.connection.saveConnections(connections, active),
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Chat)));
