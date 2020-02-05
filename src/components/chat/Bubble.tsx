  import React from 'react';
  import { connect } from 'react-redux';
  import { withRouter, RouteComponentProps } from 'react-router';
  import { actions, RootState } from '../../store';
  import { Message, Connection } from '../../store/connections/types'


type MessageProps = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> & 
{
  connection:Connection,
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

  render() {
    const {member, text, date} = this.props.message;
    const messageFromMe = member.id === -1;
    const messageFromApp = member.id === -2;
    const className = messageFromMe ?
      "Messages-message currentMember" :  messageFromApp ?
      "Messages-message appMember" : "Messages-message";
    var datestring=''
    if(date !== undefined){
      // datestring= '@'+
      datestring = new Date(date).toLocaleTimeString()
      
    }
    return (
      <li className={className} key={'msg'+this.props.idx}>
        <div className="Message-content">
        {!messageFromApp ?
          <><div className="username">
            {datestring}
          </div>
          <div className="text" onClick={() => {this.props.setChatInput(this.props.connection, this.props.message.text)}}>{text}</div>
        </>
        :
        <div className="text">{text} {datestring}</div>
        }
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = {
  setChatInput: (con: Connection, text: string|undefined) => actions.connection.setChatInput(con, text),
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(MessageBubble)));