import React
  from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { IonHeader, IonInput, IonSelect, IonSelectOption, IonText, IonBadge, IonIcon, IonToggle, IonAlert, IonGrid, IonRow, IonCol, IonFooter, IonToolbar, IonButtons, IonButton, IonBackButton, IonItem, IonList, IonChip, IonLabel, IonContent, IonCard, IonCardHeader, IonCardContent, IonTitle } from '@ionic/react';
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
  binaryType: "int8" | "uint8" | "int16" | "uint16" | "int32" | "uint32" | "float32" | "float64" | "bigint64" | "biguint64",
  binaryOffset: number
  commands: Command[]
  messages: Message[]
  showAlert: boolean,
  alertHeader?: string;
  alertMessage?: string;
  alertButtons: (AlertButton | string)[];
  beautify: boolean;
  sec_websocket_protocol: string,
  ba_password: string,
  ba_username: string,
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
    binaryType: "int8",
    binaryOffset: 0,
    commands: [],
    messages: [],
    showAlert: false,
    alertHeader: '',
    alertMessage: undefined,
    alertButtons: [],
    beautify: false,
    sec_websocket_protocol: "",
    ba_password: "",
    ba_username: "",
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
  toggleBeautify() {
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
      binaryType: this.props.connection.binaryType,
      binaryOffset: this.props.connection.binaryOffset,
      isEdited: false,
      showAlert: false,
      alertHeader: '',
      alertMessage: undefined,
      alertButtons: [],
      beautify: this.props.connection.beautify,
      messages: this.props.connection.messages,
      sec_websocket_protocol: this.props.connection.sec_websocket_protocol,
      ba_password: this.props.connection.ba_password,
      ba_username: this.props.connection.ba_username,
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
        binaryType: this.state.binaryType,
        binaryOffset: this.state.binaryOffset,
        id: this.state.id,
        ssl: this.state.ssl,
        beautify: this.state.beautify,
        // messages: [],
        autoconnect: false,
        messages: this.state.messages,
        sec_websocket_protocol: this.state.sec_websocket_protocol,
        ba_password: this.state.ba_password,
        ba_username: this.state.ba_username,
      }
      // console.log(con)
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
      commands = this.props.protocolPresets[num.detail.value][1]
    }
    else {
      commands = [] as Command[]
    }
    // this.props.setCommands(this.props.connection, commands)
    this.setState({
      ...this.state,
      commands: commands,
      isEdited: true
    })
    // this.props.saveConnections(this.props.connections)
  }
  setBinaryType(num: any) {
    this.setState({
      ...this.state,
      binaryType: num.detail.value,
      isEdited: true
    })
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
    var encrypted = 'ws://'
    if (connection.ssl) {
      encrypted = 'wss://'
    }
    // var options = {rejectUnauthorized: false};
    var url = ""
    if (connection.ba_username !== "" && connection.ba_username !== undefined){
      if (connection.ba_password !== "" && connection.ba_password !== undefined) {
        const passw = "*".repeat(connection.ba_password.length)
        url = encrypted + connection.ba_username + ":"+ passw +"@"+ connection.host + ':' + connection.port;
      }
      else{
        url = encrypted + connection.ba_username +"@"+ connection.host + ':' + connection.port;
      }
    }
    else{
      url = encrypted + connection.host + ':' + connection.port;
    }

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
              <IonLabel>{url}</IonLabel>
              {connection.info}
            </IonCardHeader>
          </IonCard>
          <IonCard>

            <IonCardHeader><Trans>Connection</Trans></IonCardHeader>
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
              </IonList>
            </IonCardContent>
          </IonCard>
          <IonCard>

            <IonCardHeader><Trans>Basic Authentication</Trans></IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Username")}
                    text={<Trans>Enter the Username for Basic Auth here</Trans>}
                    item={<IonLabel position="floating"><Trans>Username</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  {/* <InputInfoLabel label={<Trans>Host-Address</Trans>} info="The hostname (or IP-address) of Websocket-Server" > */}
                  <IonInput placeholder="username" value={this.state.ba_username} onIonChange={(e: CustomEvent, key: string = 'ba_username') => this.showSaveButton(e, key)}></IonInput>
                  {/* </InputInfoLabel> */}
                </IonItem>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Password")}
                    text={<Trans>Enter the Password for Basic Auth here</Trans>}
                    item={<IonLabel position="floating"><Trans>Password</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  {/* <InputInfoLabel label={<Trans>Host-Address</Trans>} info="The hostname (or IP-address) of Websocket-Server" > */}
                  <IonInput type="password" placeholder="" value={this.state.ba_password} onIonChange={(e: CustomEvent, key: string = 'ba_password') => this.showSaveButton(e, key)}></IonInput>
                  {/* </InputInfoLabel> */}
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
          <IonCard>

            <IonCardHeader><Trans>Advanced</Trans></IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Binary-Type")}
                    text={<Trans>The binary format of binary data sent to the client</Trans>}
                    item={<IonLabel position="floating"><Trans>Binary-Type</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  <IonSelect onIonChange={(e) => this.setBinaryType(e)} value={this.state.binaryType}>
                    <IonSelectOption value={"int8"} ><Trans>Int8</Trans></IonSelectOption>
                    <IonSelectOption value={"uint8"} ><Trans>UInt8</Trans></IonSelectOption>
                    <IonSelectOption value={"int16"} ><Trans>Int16</Trans></IonSelectOption>
                    <IonSelectOption value={"uint16"} ><Trans>UInt16</Trans></IonSelectOption>
                    <IonSelectOption value={"int32"} ><Trans>Int32</Trans></IonSelectOption>
                    <IonSelectOption value={"uint32"} ><Trans>UInt32</Trans></IonSelectOption>
                    <IonSelectOption value={"biguint64"} ><Trans>Big Int64</Trans></IonSelectOption>
                    <IonSelectOption value={"bigint64"} ><Trans>Big UInt64</Trans></IonSelectOption>
                    <IonSelectOption value={"float32"} ><Trans>Float32</Trans></IonSelectOption>
                    <IonSelectOption value={"float64"} ><Trans>Float64</Trans></IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Sec-WebSocket-Protocol")}
                    text={<Trans>Set the Sec-WebSocket-Protocol here.</Trans>}
                    item={<IonLabel position="floating"><Trans>Sec-WebSocket-Protocol</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  {/* <InputInfoLabel label={<Trans>Host-Address</Trans>} info="The hostname (or IP-address) of Websocket-Server" > */}
                  <IonInput type="password" placeholder="" value={this.state.sec_websocket_protocol} onIonChange={(e: CustomEvent, key: string = 'sec_websocket_protocol') => this.showSaveButton(e, key)}></IonInput>
                  {/* </InputInfoLabel> */}
                </IonItem>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Message Presets")}
                    text={<Trans>Select one of the predefined sets of messages.</Trans>}
                    item={<IonLabel position="floating"><Trans>Message Presets</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  <IonSelect onIonChange={(e) => this.setDefaultCommands(e)}>
                    <IonSelectOption value={-1} ><Trans>Clear</Trans></IonSelectOption>
                    {this.props.protocolPresets.map((value: [string, Command[]], idx: number) => (
                      <IonSelectOption key={'command' + idx} value={idx}>{value[0]}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Password (-> Github-repo)")}
                    text={<Trans>Enter the password of the Websocket-Server here. Look at Github to see the implementation of the password-encryption.</Trans>}
                    item={<IonLabel position="floating"><Trans>Password (-&gt; Github-repo)</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  <IonInput type="password" placeholder="" value={this.state.password} onIonChange={(e: CustomEvent, key: string = 'password') => this.showSaveButton(e, key)}></IonInput>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
          <IonCard>

            <IonCardHeader><Trans>Apperance</Trans></IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Beautify")}
                    text={<Trans>If true, messages will be parsed for JSON content, which will then by displaced interactively. Works also with Crescience-Protocol!</Trans>}
                    item={<IonLabel position="floating"><Trans>Beautify</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  <IonToggle slot='end' checked={this.state.beautify} onIonChange={() => this.toggleBeautify()}></IonToggle>
                </IonItem>
                {/* <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Timeout [s]")}
                    text={<Trans>This timeout determines, how long the client waits for an answer. Increase it, If you encounter connectivity problems</Trans>}
                    item={<IonLabel position="floating"><Trans>Timeout [s]</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  <IonInput type="number" placeholder="5" value={"" + this.state.timeout} onIonChange={(e: CustomEvent, key: string = 'timeout') => this.showSaveButton(e, key)}></IonInput>
                </IonItem> */}
                {/* <IonItem>
                  <DescriptionFloater
                    title={this.props.t("Binary-Offset")}
                    text={<Trans>The binary offset of binary data sent to the client</Trans>}
                    item={<IonLabel position="floating"><Trans>Binary-Offset</Trans></IonLabel>}
                    theme={this.props.theme}
                  />
                  <IonInput type="number" placeholder="0" value={"" + this.state.binaryOffset} onIonChange={(e: CustomEvent, key: string = 'binaryOffset') => this.showSaveButton(e, key)}></IonInput>
                </IonItem> */}
              </IonList>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <Trans>Sent Messages</Trans>
            </IonCardHeader>

            <IonCardContent className="ion-padding">
              {/* <IonItemDivider></IonItemDivider> */}
              <IonList>
                {
                  this.state.commands.filter((value: Command) => value.num>0).sort(((a, b) => (
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
                  <IonButton expand="full" fill="solid" color="success" onClick={(e) => this.saveConnection(e)}>
                    <Trans>Save</Trans>
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton expand="full" fill="solid" color="danger" onClick={() => this.resetState()}>
                    <Trans>Discard</Trans>
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
