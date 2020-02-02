  import React from 'react';
  import { connect } from 'react-redux';
  import { withRouter, RouteComponentProps } from 'react-router';
  import { actions, RootState } from '../../store';
  import { Message } from '../../store/connections/types'


type MessageProps = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> & 
{
  message:Message, 
  idx:number,
};

type MessageState = {
};

class MessageBubble extends React.Component<MessageProps, MessageState> {
  defaultState: MessageState = {
  }

  constructor(props: MessageProps) {
    super(props);

    this.state = {
      ...this.defaultState
    };
  }

  sendWebsocket(msg: string) {
    this.props.setChatInput(msg)
    
  }

  render() {
    const {member, text, date} = this.props.message;
    const currentMember = this.props.active;
    if(currentMember === undefined) {return}
    const messageFromMe = member.id === -1;
    const className = messageFromMe ?
      "Messages-message currentMember" : "Messages-message";
    var datestring=''
    if(date !== undefined){
      datestring= '@'+new Date(date).toLocaleTimeString()
      
    }
    return (
      <li className={className} key={'msg'+this.props.idx}>
        <div className="Message-content">
          <div className="username">
            {member.name} {datestring}
          </div>
          <div className="text" key={text} onClick={() => {this.sendWebsocket(this.props.message.text)}}>{text}</div>
        </div>
      </li>
    );
    // return (
    //   <IonItem onClick={() => console.log(this.props.message)}>
    //   {/* <span
    //     className="avatar"
    //     style={{backgroundColor: 'black'}}
    //   /> */}
    //     {/* <div className="Message-content"> */}
    //       <IonLabel>
    //         {member.name}
    //       </IonLabel>
    //       <IonText className="text" key={text} onClick={() => {this.sendWebsocket(this.props.message.text)}}>{text}</IonText>
    //     {/* </div> */}
    //   </IonItem>
    // );
  }
}

const mapStateToProps = (state: RootState) => ({
  active: state.connections.active,
});

const mapDispatchToProps = {
  sendWebsocket: (message: string) => actions.connection.sendWebsocket(message),
  setChatInput: (text: string|undefined) => actions.connection.setChatInput(text),
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(MessageBubble)));