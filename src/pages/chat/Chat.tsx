import {
  IonButtons,
  IonContent,
  IonPage,
  IonHeader,
  IonBackButton,
  IonToolbar,
  IonFooter,
  IonTitle,
  IonIcon,
  IonButton,
  IonItem, IonList, IonLabel, IonPopover
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
  menu
} from 'ionicons/icons';


type Props = RouteComponentProps<{ id: string, tab: string }> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  textinput: string;
  showPopover: boolean;
  event: React.MouseEvent | undefined;
};


class Chat extends Component<Props & WithTranslation, State> {
  state = {
    textinput: '',
    showPopover: false,
    event: undefined
  };

  shouldComponentUpdate(props:Props, newState:State){
    console.log('Update chat')
    return true
  }

  onSubmit(e: React.FormEvent) {
    e.preventDefault()
    this.onSubmit2()
  }
  onSubmit2() {
    if (this.props.connection === undefined) { return }
    this.setState({ textinput: "" });
    this.props.sendWebsocket(this.props.connection, this.state.textinput);
    // if(this.props.active===undefined){return}
    this.props.saveConnections(this.props.connections, this.props.connection)
  }
  onChange(e: any) {
    this.setState({ textinput: e.target.value });
  }

  clearMessages() {
    if (this.props.connection === undefined) { return }
    this.props.clearMessages(this.props.connection);
  }

  filterCommands(commands: Command[], searchtext: string, count: number) {
    return commands.filter(comm2 => comm2.value.toLowerCase() !== searchtext.toLowerCase()).filter(comm => comm.value.toLowerCase().indexOf(searchtext.toLowerCase()) !== -1).sort((a, b) => (
      b.num - a.num
    )).slice(0, count).reverse()
  }
  showMenu(e:React.MouseEvent) {
    e.persist()
    this.setState({ ...this.state, showPopover: !this.state.showPopover, event:e })
  }
  connect(e:React.MouseEvent) {
    if(this.props.connection===undefined){return}
    e.preventDefault()
    this.props.establishConnection(this.props.connection)
  }

  render() {

    var text = this.state.textinput
    var commands: Command[] = []
    if (this.props.connection === undefined) { return (<></>) }
    if (this.props.connection.chatInput !== undefined) {
      this.setState({ ...this.state, textinput: this.props.connection.chatInput })
      text = this.props.connection.chatInput
      this.props.setChatInput(this.props.connection, undefined)
    }
    commands = this.filterCommands(this.props.connection.commands, text, 3);
    const connection = this.props.connection
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref='/connect' />
              {/* <IonMenuButton /> */}
            </IonButtons>
            <IonButton expand="full" fill="outline" routerLink={'/connect/' + this.props.connection.id}><IonTitle>{this.props.connection.name}</IonTitle></IonButton>
            <IonButtons slot="end">
              <IonPopover
                isOpen={this.state.showPopover}
                event={this.state.event}
                onDidDismiss={e => this.setState({ ...this.state, showPopover: false })}
              >
                <IonButton expand="full" routerLink={'/connect/' + this.props.connection.id}><Trans>Settings</Trans></IonButton>
                <IonButton expand="full" onClick={() => { this.clearMessages() }}><Trans>Clear</Trans></IonButton>
                {this.props.connection.connected === false?
                <IonButton color="secondary" expand="full" onClick={() => (this.props.establishConnection(connection))}>Connect</IonButton>
                :
                <IonButton color="error" expand="full" onClick={() => (this.props.quitConnection(connection))}>Disconnect</IonButton>
                }
              </IonPopover>
              <IonButton onClick={(e) => this.showMenu(e)}><Trans><IonIcon icon={menu}></IonIcon></Trans></IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <ChatList
            connection={this.props.connection}
            messages={this.props.connection.messages}
          ></ChatList>
        </IonContent>
        <IonFooter className="Footer" style={{ "backgroundColor": "transparent" }}>
          {this.props.connection.connected === true ?
            <>
              {(this.state.textinput.length > 0 && commands.length > 0) &&

                <IonList color='secondary'>
                  {commands.map((c: Command, idx: number) => (
                    <IonItem key={'recom' + idx} onClick={() => this.props.setChatInput(connection, c.value)}>
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
            </>
            :
            <IonButton expand="full" onClick={(e) => (this.connect(e))}>Connect</IonButton>
          }
        </IonFooter>
      </IonPage>
    );
  };

  updateState(event: any, key: string) {
    this.setState({ ...this.state, [key]: event.target.value })
  }

}
const mapStateToProps = (state: RootState, ownProps: RouteComponentProps<{ id: string, tab: string }>) => ({
  connections: state.connections.connections,
  connection: selectors.connection.connectionByID(state.connections.connections, parseInt(ownProps.match.params.id, 10)),
  // messages: state.connections.messages,
  // chatInput: state.connections.chatInput
});

const mapDispatchToProps = {
  quitConnection: (connection: Connection) => actions.connection.quitConnection(connection),
  establishConnection: (connection: Connection) => actions.connection.establishConnection(connection),
  sendWebsocket: (con: Connection, message: string) => actions.connection.sendWebsocket(con, message),
  clearMessages: (con: Connection) => actions.connection.clearMessages(con),
  setChatInput: (con: Connection, text: string | undefined) => actions.connection.setChatInput(con, text),
  saveConnections: (connections: Connection[], active: Connection) => actions.connection.saveConnections(connections, active),
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Chat)));
