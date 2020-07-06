import React
  from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { IonHeader, IonInput, IonSelect, IonSelectOption, IonText, IonBadge, IonIcon, IonToggle, IonAlert, IonGrid, IonRow, IonCol, IonFooter, IonToolbar, IonButtons, IonButton, IonBackButton, IonItem, IonList, IonChip, IonLabel, IonContent, IonCard, IonCardHeader, IonCardContent, IonTitle, IonItemDivider } from '@ionic/react';
import { RootState, actions, selectors } from '../../store';
import { Connection, Message, Command } from '../../store/connections/types';
import { save } from 'ionicons/icons';
import DescriptionFloater from '../../components/DescriptionFloater';
import { AlertButton } from '@ionic/react';


import { Trans } from 'react-i18next';
import { withTranslation, WithTranslation } from 'react-i18next';


type Props = RouteComponentProps<{ id: string, tab: string }> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> & {
  goBack: () => void
};

type State = {
  isDeleted: boolean
  isEdited: boolean
  name: string
  host: string
  port: number
  password: string
  timeout: number
  id: number
  ssl: boolean
  info: string
  commands: Command[]
  messages: Message[]
  showAlert: boolean,
  alertHeader?: string;
  alertMessage?: string;
  alertButtons: (AlertButton | string)[];
  beautify: boolean;
}

class ConnectionDetail extends React.PureComponent<Props & WithTranslation, State> {
  defaultState: State = {
    isDeleted: false,
    isEdited: false,
    name: '',
    host: '',
    port: 0,
    password: '',
    timeout: 5,
    id: -1,
    ssl: false,
    info: '',
    commands: [],
    messages: [],
    showAlert: false,
    alertHeader: '',
    alertMessage: undefined,
    alertButtons: [],
    beautify: false
  }

  constructor(props: Props & WithTranslation) {
    super(props);

    this.state = {
      ...this.defaultState
    };
  }

  componentDidUpdate() {
    if (this.props.reducerHistory !== undefined) {
      this.props.history.push(this.props.reducerHistory)
      this.props.clearReducerHistory()
    }
  }

  componentDidMount() {
    this.resetState()
  }

  showSaveButton(event: any, key: string) {
    this.setState({ ...this.state, [key]: event.target.value, 'isEdited': true })
  }

  toggleSSL() {
    this.setState({ ...this.state, 'ssl': !this.state.ssl, 'isEdited': true })
  }
  toggleBeautify(){
    this.setState({ ...this.state, 'beautify': !this.state.beautify, 'isEdited': true })
  }

  resetState() {
    if (this.props.connection === undefined) {
      return undefined;
    }
    this.setState({
      name: this.props.connection.name,
      host: this.props.connection.host,
      port: this.props.connection.port,
      password: this.props.connection.password,
      timeout: this.props.connection.timeout,
      info: this.props.connection.info,
      commands: this.props.connection.commands,
      id: this.props.connection.id,
      ssl: this.props.connection.ssl,
      isEdited: false,
      showAlert: false,
      alertHeader: '',
      alertMessage: undefined,
      alertButtons: [],
      beautify: this.props.connection.beautify,
      messages: this.props.connection.messages,
    })
  }

  removeConnection() {
    this.setState({
      showAlert: true,
      alertHeader: this.props.t("Remove"),
      alertMessage: this.props.t('Would you like to remove this connection?'),
      alertButtons: [
        {
          text: this.props.t('Cancel'),
          handler: () => this.setState({ showAlert: false })
        },
        {
          text: this.props.t('Remove'),
          handler: () => {
            if (this.props.connection !== undefined) {
              this.props.removeConnection(this.props.connection);
              this.props.saveConnections(this.props.connections)
              this.props.history.push('/connect')
            }
          }
        }
      ]
    })
  }

  saveConnection(event: any) {
    if (this.state.isEdited) {
      this.setState({ ...this.state, 'isEdited': false })
      event.preventDefault();

      var con: Connection = {
        name: this.state.name,
        host: this.state.host,
        port: this.state.port,
        password: this.state.password,
        timeout: this.state.timeout,
        connected: false,
        commands: this.state.commands,
        info: this.state.info,
        id: this.state.id,
        ssl: this.state.ssl,
        beautify: this.state.beautify,
        // messages: [],
        autoconnect: false,
        messages: this.state.messages
      }
      this.props.editConnection(con)
      this.props.saveConnections(this.props.connections)
    }
  }
  removeCommand(value: Command) {
    if (this.props.connection === undefined) { return }
    this.props.removeCommand(this.props.connection, value)
    this.props.saveConnections(this.props.connections)
  }
  setDefaultCommands(num: any) {
    if (this.props.connection === undefined) { return }
    var commands = [] as Command[]
    if (num.detail.value >= 0) {
      commands = this.props.protocolPresets[num.detail.value][1]}
    else{
      commands = [] as Command[]
    }
    this.props.setCommands(this.props.connection, commands)
  }

  render() {
    if (this.props.connection === undefined) {
      return (<IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={'/connect'} />
          </IonButtons>
          <IonTitle><Trans>No connection</Trans></IonTitle>
        </IonToolbar>
      </IonHeader>
      );
    }
    const connection = this.props.connection;

    return (
      <>
        <IonAlert
          isOpen={this.state.showAlert}
          header={this.state.alertHeader}
          buttons={this.state.alertButtons}
          onDidDismiss={() => this.setState({ showAlert: false })}
        ></IonAlert>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={'/chat/' + connection.id} />
            </IonButtons>
            <IonTitle>{this.state.name}</IonTitle>
            {this.state.isEdited ?
              <IonButtons slot="end">
                <IonButton onClick={(e) => this.saveConnection(e)}><IonIcon icon={save} /></IonButton>
              </IonButtons>
              : <></>}
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardHeader>
              <h1>{this.state.name}
                <IonChip slot="end">
                  <IonLabel color={(connection.connected ? "success" : "danger")}>{(connection.connected ? "Online" : "Offline")}</IonLabel>
                </IonChip></h1>
              {connection.info}
            </IonCardHeader>

            <IonCardContent className="ion-padding">
              <IonList>
                <IonItem>


                  <DescriptionFloater
                    title={this.props.t("Host-Address")}
                    text={<Trans>Enter the IP-Adress/the Hostname of the Websocket-Server here</Trans>}
                    item={<IonLabel position="floating"><Trans>Host-Address</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  {/* <InputInfoLabel label={<Trans>Host-Address</Trans>} info="The hostname (or IP-address) of Websocket-Server" > */}
                  <IonInput placeholder="http://localhost" value={this.state.host} onIonChange={(e: CustomEvent, key: string = 'host') => this.showSaveButton(e, key)}></IonInput>
                  {/* </InputInfoLabel> */}
                </IonItem>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Port")}
                    text={<Trans>Enter the port of the Websocket-Server here (Default-SSL: 443). If the websocket is hosted on a seperate domain, the port should be 80 (without SSL) or 443 (with SSL).</Trans>}
                    item={<IonLabel position="floating"><Trans>Port</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  <IonInput type="number" placeholder="443" value={"" + this.state.port} onIonChange={(e: CustomEvent, key: string = 'port') => this.showSaveButton(e, key)}></IonInput>
                </IonItem>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("SSL")}
                    text={<Trans>Decide, if the Server uses SSL-encryption. SSL needs some more configuration. Self-signed cetificates are not allowed in Android (You could maybe install it).</Trans>}
                    item={<IonLabel position="floating"><Trans>SSL</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  <IonToggle slot='end' checked={this.state.ssl} onIonChange={() => this.toggleSSL()}></IonToggle>
                </IonItem>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Beautify")}
                    text={<Trans>If true, messages will be parsed for JSON content, which will then by displaced interactively. Works also with Crescience-Protocol!</Trans>}
                    item={<IonLabel position="floating"><Trans>Beatify</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  <IonToggle slot='end' checked={this.state.beautify} onIonChange={() => this.toggleBeautify()}></IonToggle>
                </IonItem>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Password (-> Github-repo)")}
                    text={<Trans>Enter the password of the Websocket-Server here. Look at Github to see the implementation of the password-encryption.</Trans>}
                    item={<IonLabel position="floating"><Trans>Password</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  <IonInput type="password" placeholder="" value={this.state.password} onIonChange={(e: CustomEvent, key: string = 'password') => this.showSaveButton(e, key)}></IonInput>
                </IonItem>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Timeout [s]")}
                    text={<Trans>This timeout determines, how long the client waits for an answer. Increase it, If you encounter connectivity problems</Trans>}
                    item={<IonLabel position="floating"><Trans>Timeout [s]</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  <IonInput type="number" placeholder="5" value={"" + this.state.timeout} onIonChange={(e: CustomEvent, key: string = 'timeout') => this.showSaveButton(e, key)}></IonInput>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <Trans>Commands</Trans>
            </IonCardHeader>

            <IonCardContent className="ion-padding">
              <IonItem>
                <DescriptionFloater
                  title={this.props.t("Protocol Presets")}
                  text={<Trans>Select one of the predefined protocols</Trans>}
                  item={<IonLabel position="floating"><Trans>Protocol Presets</Trans></IonLabel>}
                  theme={this.props.theme}
                />
                <IonSelect onIonChange={(e) => this.setDefaultCommands(e)}>
                  <IonSelectOption value={-1} ><Trans>Clear</Trans></IonSelectOption>
                  {this.props.protocolPresets.map((value: [string, Command[]], idx:number)=>(
                    <IonSelectOption key={'command'+idx} value={idx}>{value[0]}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItemDivider></IonItemDivider>
              <IonList>
                {
                  this.props.connection.commands.sort(((a, b) => (
                    b.num - a.num
                  ))).map((value: Command, index: number) => (
                    <IonItem key={'command' + index} onClick={(e) => this.removeCommand(value)}>
                      <IonText>{value.value}</IonText>
                      <IonBadge color="success" slot="end">
                        {value.num}
                      </IonBadge>
                    </IonItem>
                  ))
                }
              </IonList>
            </IonCardContent>
          </IonCard>
        </IonContent>

        <IonFooter className="Footer" >
          {!this.state.isEdited ?
            <IonGrid>
              <IonRow>
                <IonCol col-6>
                  {!connection.connected ?
                    <IonButton expand="full" fill="solid" color="secondary" onClick={() => {
                      this.props.establishConnection(connection)
                    }
                    }>
                      <Trans>Connect</Trans>
                    </IonButton>
                    :
                    <IonButton expand="full" fill="solid" color="danger" onClick={() => this.props.quitConnection(connection)}>
                      <Trans>Disconnect</Trans>
                    </IonButton>
                  }
                </IonCol>
                <IonCol>
                  <IonButton expand="full" fill="solid" color="danger" onClick={() => this.removeConnection()
                  }>
                    <Trans>Remove</Trans>
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
            :
            <IonGrid>
              <IonRow>
                <IonCol col-6>
                  <IonButton expand="full" fill="solid" color="danger" onClick={() => this.resetState()}>
                    <Trans>Discard</Trans>
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton expand="full" fill="solid" color="success" onClick={(e) => this.saveConnection(e)}>
                    <Trans>Save</Trans>
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          }
        </IonFooter>
      </>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: RouteComponentProps<{ id: string, tab: string }>) => ({
  connections: state.connections.connections,
  connection: selectors.connection.connectionByID(state.connections.connections, parseInt(ownProps.match.params.id, 10)),
  reducerHistory: state.connections.history,
  theme: state.connections.theme,
  protocolPresets: state.connections.protocolPresets
});

const mapDispatchToProps = {
  establishConnection: (connection: Connection) => actions.connection.establishConnection(connection),
  quitConnection: (connection: Connection) => actions.connection.quitConnection(connection),
  removeConnection: (connection: Connection) => actions.connection.removeConnection(connection),
  editConnection: (connection: Connection) => actions.connection.editConnection(connection),
  saveConnections: (connections: Connection[]) => actions.connection.saveConnections(connections),
  clearReducerHistory: () => actions.connection.clearReducerHistory(),
  removeCommand: (connection: Connection, command: Command) => actions.connection.removeCommand(connection, command),
  setCommands: (connection: Connection, commands: Command[]) => actions.connection.setCommands(connection, commands),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ConnectionDetail))
