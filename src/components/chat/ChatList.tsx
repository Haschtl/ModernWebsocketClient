import React from 'react';
import { Message, Connection } from '../../store/connections/types';
import {
  IonList, IonContent, IonListHeader, IonFabButton, IonFab, IonIcon,
  IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/react';
import { Trans } from 'react-i18next';
import MessageBubbler from './Bubble';
// import { animateScroll } from "react-scroll";
import { arrowDown } from 'ionicons/icons';


interface Props {
  messages: Message[],
  connection: Connection,
  autoScroll: boolean
}

interface State {
  isAtEnd: boolean,
  isAtTop: boolean,
  msgCounter: number,
}

class ChatList extends React.Component<Props, State> {
  contentRef: React.RefObject<any> | null  
  // ionRefresherRef: React.RefObject<HTMLIonRefresherElement>;

  state: State = {
    isAtEnd: true,
    isAtTop: false,
    msgCounter: 10
  }

  constructor(props: Props) {
    super(props);
    this.contentRef = React.createRef();
    // this.ionRefresherRef = React.createRef<HTMLIonRefresherElement>();
  }
  scrollToBottom(e: CustomEvent) {
    if(this.props.autoScroll === true) {return}
    e.preventDefault()
    // @ts-ignore
    this.contentRef.current.scrollToBottom();
    // this.setState({...this.state, isAtEnd:true})
    this.setState({ ...this.state, isAtEnd: true })
  };

  // doRefresh = () => {
  //   this.setState({ ...this.state, isAtEnd: true })
  // };
  componentDidMount() {
    // @ts-ignore
    this.contentRef.current.scrollToBottom();
    this.setState({ ...this.state, isAtEnd: true })
  }
  componentDidUpdate() {

    if (this.state.isAtEnd === true) {
      // @ts-ignore
      this.contentRef.current.scrollToBottom();
      // this.setState({...this.state, isAtEnd:true})
    }
  }
  // scroll(e:CustomEvent) {
  //   console.log(e)
  // }
  scrollEnd(e: CustomEvent) {
    // @ts-ignore
    e.target.getScrollElement()
      // @ts-ignore
      .then((currentTime:any) => {
        if(currentTime.scrollHeight-currentTime.clientHeight-currentTime.scrollTop<=50){
        this.setState({ ...this.state, isAtEnd: true })
        }
        else{
          this.setState({ ...this.state, isAtEnd: false })
        }
      })
    // console.log(scroller)
    // setTimeout(() => {
    // },1000)
  }
  // scrollStart(e:CustomEvent) {
  //   console.log(e)
  // }
  atEnd(e: React.MouseEvent) {
    e.preventDefault()
    // @ts-ignore
    this.contentRef.current.scrollToBottom();
    // this.setState({...this.state, isAtEnd:true})
    this.setState({ ...this.state, isAtEnd: true })
  }

  showNext($event: CustomEvent) {
    console.log('Loading more events...')
    var counter = this.state.msgCounter + 10
    var disableScroll = false
    // if (counter>= this.state.eventGroups.length) {
    //   disableScroll = true
    //   counter = this.state.eventGroups.length
    // }
    if (counter >= this.props.messages.length) {
      disableScroll = true
      counter = this.props.messages.length
      console.log('End of eventlist reached')
    }
    this.setState({
      ...this.state,
      isAtTop: disableScroll,
      msgCounter: counter
    });
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }


  render() {
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
      <IonContent
        ref={this.contentRef}
        scrollEvents={true}
        // onIonScroll={(e:CustomEvent) => this.scroll(e)}
        onIonScrollEnd={(e:CustomEvent) => this.scrollEnd(e)}
        // onIonScrollStart={(e: CustomEvent) => this.scrollStart(e)}
      >
        <IonInfiniteScroll
          // threshold="100px"
          disabled={this.state.isAtTop}
          onIonInfinite={(e: CustomEvent<void>) => this.showNext(e)}>
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more messages...">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>
        <IonList>
          {messages.map((m: Message, idx: number) => (
            <MessageBubbler
              connection={this.props.connection}
              message={m}
              key={'msge' + idx}
              idx={idx}
            >
            </MessageBubbler>
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" color="dark" hidden={this.state.isAtEnd}>
          <IonFabButton onClick={(e: React.MouseEvent) => this.atEnd(e)}>
            <IonIcon icon={arrowDown} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    );
  };
}

export default ChatList;