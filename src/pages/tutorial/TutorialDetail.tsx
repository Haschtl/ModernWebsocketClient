import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState, selectors } from '../../store';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonItem, IonList, IonText, IonContent, IonTitle } from '@ionic/react';
import ReactPlayer from 'react-player'


type Props = RouteComponentProps<{ id: string, tab: string }> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> & {
  goBack: () => void
};

const TutorialDetail: React.FunctionComponent<Props> = ({ tutorial, match, goBack }) => {
  if (tutorial === undefined) {
    return null;
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref='/tutorial' />
          </IonButtons>
          <IonTitle>{tutorial.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {tutorial.video !== undefined &&
          <IonItem style={{ margin: 0, top: 0, left: 0, right: 0, padding: 0 }}>
          <ReactPlayer key={'video' + match.params.id} loop={true} muted={true} url={tutorial.video} playing height="80%" style={{ margin: 0, top: 0, left: 0, right: 0, padding: 0 }} />
          </IonItem>
        }
          <IonList>
          {tutorial.text !== undefined &&
            <IonItem >
              <IonText style={{display:"block"}}>{tutorial.text}</IonText>
            </IonItem>
          }
          {tutorial.custom !== undefined &&
            <IonItem>
              {tutorial.custom}
            </IonItem>
          }
        </IonList>
      </IonContent>

    </>
  );
}

const mapDispatchToProps = {
};

const mapStateToProps = (state: RootState, ownProps:RouteComponentProps<{ id: string, tab: string }>) => ({
  tutorial: selectors.connection.tutorialByID(state.connections.tutorials, parseInt(ownProps.match.params.id, 10)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialDetail)
