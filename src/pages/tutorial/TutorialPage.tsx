import { IonItem, IonList, IonItemDivider, IonText, IonContent, IonPage, IonTitle, IonHeader, IonIcon, IonToolbar, IonButtons, IonButton } from '@ionic/react';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState, actions } from '../../store';
import { Trans } from 'react-i18next';
// import ReactPlayer from 'react-player'
import { Tutorial } from '../../store/connections/types'


const TUTORIALS = [
  {
    video: 'assets/videos/c_createConnection.mp4',
    title: <Trans>Create a new connection to a Websocket-server</Trans>,
    text: <Trans>Go to the connection page, Click the round "+"-Button and enter at least a name, a hostname and click on "Save"</Trans>,
    id: 0,
    group: 'connections'
  },{
    title: <Trans>Welcome</Trans>,
    text: <Trans>Welcome</Trans>,
    id: 1,
    group: 'app'
  },
] as Tutorial[]

type ListProps = RouteComponentProps<{}> & {
  appTutorials: Tutorial[];
  connectionTutorials: Tutorial[];

}
const TutorialList: React.FunctionComponent<ListProps> = ({ appTutorials, connectionTutorials, history, location, match }) => {
  return (
    <IonList>
      <IonItemDivider sticky><Trans>App-Settings</Trans></IonItemDivider>
      {appTutorials.map((tut: Tutorial, tutIndex: number) => (
        <TutorialListItem
          tutorial={tut}
          key={`c-${tutIndex}`}
          history={history}
          match={match}
          location={location}
        />
      ))}
      <IonItemDivider sticky><Trans>Connections</Trans></IonItemDivider>
      {connectionTutorials.map((tut: Tutorial, tutIndex: number) => (
        <TutorialListItem
          tutorial={tut}
          key={`c-${tutIndex}`}
          history={history}
          match={match}
          location={location}
        />
      ))}

      {/* <IonItemDivider sticky><Trans>Signals</Trans></IonItemDivider>
      {signalTutorials.map((tut: Tutorial, tutIndex: number) => (
        <TutorialListItem
          tutorial={tut}
          key={`c-${tutIndex}`}
          history={history}
          match={match}
          location={location}
        />
      ))} */}
    </IonList>
  );
};

type ItemProps = RouteComponentProps<{}> & {
  tutorial: Tutorial;

}

class TutorialListItem extends React.PureComponent<ItemProps> {
  // const TutorialListItem: React.SFC<ItemProps> = ({ tutorial, history }) => {
  render() {
    return (
      <IonItem button detail={true} routerLink={'/tutorial/' + this.props.tutorial.id}>
        <IonText style={{ display: 'block' }}>
          {this.props.tutorial.title}
        </IonText>
      </IonItem>
    );
  }
}


type Props = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  segment: string;
  isRefreshing: boolean;
  showLoading: boolean;
  showFilterModal: boolean;
  loadingMessage: string;
  showPlot: boolean;
};

class TutorialPage extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.props.setTutorials(TUTORIALS)
  }

  render = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton routerLink={'/connect'}><IonIcon slot="end" name="arrow-forward"></IonIcon></IonButton>
            </IonButtons>
            <IonTitle><Trans>Tutorial</Trans></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scroll-y="true">
          <TutorialList
            appTutorials={this.props.tutorials.filter((name, idx) => name.group === 'app')}
            connectionTutorials={this.props.tutorials.filter((name, idx) => name.group === 'connections')}
            history={this.props.history}
            location={this.props.location}
            match={this.props.match}
          />
        </IonContent></IonPage>
    );
  }
}



const mapStateToProps = (state: RootState) => ({
  tutorials: state.connections.tutorials
});

const mapDispatchToProps = {
  setTutorials: (tuts: Tutorial[]) => actions.connection.setTutorials(tuts)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialPage);