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

const RTOCCOMMANDS = [
  { value: '{"getLatest": true}', num: 0 },
  { value: '{"getSignalList": true}', num: 0 },
  { value: '{"getEventList": true}', num: 0 },
  { value: '{"getPluginList": true}', num: 0 },
  { value: '{"unsubscribeAll": true}', num: 0 },
  { value: '{"subscribeAll": true}', num: 0 },
  { value: '{"getSession": true}', num: 0 },


  { value: '{"plugin": {"Generator":{"start":true}}}', num: 0 },
  { value: '{"plugin": {"Generator":{"start":false}}}', num: 0 },
  { value: '{"plugin": {"Generator":{"autostart":true}}}', num: 0 },
  { value: '{"plugin": {"Generator":{"samplerate":5}}}', num: 0 },
  { value: '{"plugin": {"Generator":{"setAmplitude()":[5]}}}', num: 0 },


  { value: '{"logger": {"resize":500}}', num: 0 },
  { value: '{"logger": {"export":["filename","json"]}}', num: 0 },
  { value: '{"logger": {"export":["filename","xlsx"]}}', num: 0 },
  { value: '{"logger": {"export":["filename","csv"]}}', num: 0 },
  { value: '{"logger": {"info":true}}', num: 0 },
  { value: '{"logger": {"reboot":true}}', num: 0 },
  { value: '{"logger": {"backup":{"now":true}}}', num: 0 },
  { value: '{"logger": {"backup":{"resample":0}}}', num: 0 },
  { value: '{"logger": {"backup":{"interval":1}}}', num: 0 },
  { value: '{"logger": {"backup":{"active":true}}}', num: 0 },
  { value: '{"logger": {"backup":{"loadOnOpen":true}}}', num: 0 },
  { value: '{"logger": {"backup":{"autoIfFull":true}}}', num: 0 },
  { value: '{"logger": {"backup":{"autoOnClose":true}}}', num: 0 },
  { value: '{"logger": {"backup":{"clear":true}}}', num: 0 },
  { value: '{"logger": {"postgresql":{"active":true}}}', num: 0 },
  { value: '{"logger": {"tcp":{"active":true}}}', num: 0 },
  { value: '{"logger": {"telegram":{"active":true}}}', num: 0 },
  { value: '{"logger": {"tcp":{"port":5050}}}', num: 0 },
  { value: '{"logger": {"global":{"samplerate":10}}}', num: 0 },
  { value: '{"logger": {"clear":"all"}}', num: 0 },
  { value: '{"logger": {"clear":"events"}}', num: 0 },
  { value: '{"logger": {"clear":["Geneator.Square"]}}', num: 0 },


  { value: '{"userAction": "myCustomAction"}', num: 0 },


  { value: '{"automation": {"setAction":{"name":"Action1","script":"print("Hello"),"active":true,"listenID":["listener1"]}}}', num: 0 },
  { value: '{"automation": {"setEvent:{"name":"Event1","cond":"Generator.Square>=1","text":"Big square","sname":"Square","dname":"Generator","trigger":"rising","priority":1}}}', num: 0 },
  { value: '{"automation": {"testAction":"Action1"}}', num: 0 },
  { value: '{"automation": {"testEvent":"Event1"}}', num: 0 },
  { value: '{"automation": {"removeAction":"Action1"}}', num: 0 },
  { value: '{"automation": {"removeEvent":"Event1"}}', num: 0 },
  { value: '{"automation": {"active":{"events":[],"actions":[]}}}', num: 0 },
  { value: '{"automation": {"reset":true}}', num: 0 },


  { value: '{"getEvent": ["Generator.Square"]}', num: 0 },
  { value: '{"remove": ["Generator.Square"]}', num: 0 },
  { value: '{"subscribe": ["signal","Generator.Square"]}', num: 0 },
  { value: '{"subscribe": ["device","Generator"]}', num: 0 },
  { value: '{"unsubscribe": ["signal","Generator.Square"]}', num: 0 },
  { value: '{"unsubscribe": ["device","Generator"]}', num: 0 },
  { value: '{"getSignal": ["Generator.Square"]}', num: 0 },
  { value: '{"getSignal": "all"}', num: 0 },
  { value: '{"getSignal": {"dname":"Generator,"sname":"Square","xmin":0,"xmax":50000000,"database":true,"maxN":100}}', num: 0 },
  { value: '{"event": {"text":"Example","dname":"Device","sname":"Test", "priority":2}}', num: 0 },
  { value: '{"y":[1],"sname":["Test"],"dname":"Device","unit":"Bananas"}', num: 0 },
]

const DENEBCOMMANDS = [
  { value: 'root:login(COOKIE,app,5)', num: 0 },
  { value: 'root:logout()', num: 0 },
  { value: 'root:aliases', num: 0 },
  { value: 'root:allAliases', num: 0 },
  { value: 'debug:users', num: 0 },
  { value: 'debug:USERNAME', num: 0 },
  { value: 'debug:USERNAME.ALIAS', num: 0 },

  { value: 'deneb-*:engine-1:power:analog=0', num: 0 },
  { value: 'deneb-*:engine-1:power:analog=10', num: 0 },
  { value: 'deneb-*:engine-1:power:analog=100', num: 0 },
  { value: 'deneb-*:engine-1:power:analog=255', num: 0 },
  { value: 'deneb-*:engine-*:power:analog=255', num: 0 },
  { value: 'deneb-*:engine-*:power:analog=0', num: 0 },
  { value: 'deneb-1:websocket:remote-server:multicast:subscribe()', num: 0 },
  { value: 'deneb-*:websocket:remote-server:multicast:unsubscribe()', num: 0 },
  { value: 'deneb-*:temperature;', num: 0 },
]

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
      id: this.props.connection.id,
      ssl: this.props.connection.ssl,
      isEdited: false,
      showAlert: false,
      alertHeader: '',
      alertMessage: undefined,
      alertButtons: [],
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
    if (num.detail.value === 0) {
      commands = [...DENEBCOMMANDS
      ] as Command[]
    }
    else if (num.detail.value === 1) {
      commands = [...RTOCCOMMANDS] as Command[]
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
                    title={this.props.t("Password")}
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
                  <IonSelectOption value={0} ><Trans>Crescience Deneb</Trans></IonSelectOption>
                  <IonSelectOption value={1} ><Trans>RTOC</Trans></IonSelectOption>
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
  theme: state.connections.theme
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
