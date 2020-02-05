import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { actions, RootState } from '../../store';
import { Message, Connection } from '../../store/connections/types'
import {
  IonItemDivider
} from '@ionic/react';
import JSONTree from 'react-json-tree'

type MessageProps = RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> &
{
  connection: Connection,
  message: Message,
  idx: number,
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
    const { member, text, date } = this.props.message;
    const messageFromMe = member.id === -1;
    const messageFromApp = member.id === -2;
    const className = messageFromMe ?
      "Messages-message currentMember" : messageFromApp ?
        "Messages-message appMember" : "Messages-message";
    const className2 = messageFromMe ?
      "Messages-message CurrentJsonMember" : messageFromApp ?
        "Messages-message appMember" : "Messages-message JsonMember";
    var datestring = ''
    var timestring = ''
    if (date !== undefined) {
      // datestring= '@'+
      timestring = new Date(date).toLocaleTimeString()
      datestring = new Date(date).toLocaleDateString()

    }
    var json=undefined
    try{
    json = JSON.parse(text)
    }
    catch{
      
    }
    return (<>
      {this.props.idx % 5 === 0 &&
        <IonItemDivider sticky style={{textAlign: 'center'}}>
          {timestring}&nbsp;&nbsp;{datestring}
        </IonItemDivider>
      }
      <li className={className} key={'msg' + this.props.idx}>
        <div className="Message-content">
          {messageFromApp ?
            <div className="text">{text} @{timestring}</div>
            :
            json === undefined ?
            <div className="text" onClick={() => { this.props.setChatInput(this.props.connection, this.props.message.text) }}>{text}</div>
            :
            <JSONTree data={json} 
            hideRoot={true} 
            theme={{tree: (style:any) => ({ style: { ...style, backgroundColor: undefined }, className: className2 }),}}
          />
          }
        </div>
      </li></>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = {
  setChatInput: (con: Connection, text: string | undefined) => actions.connection.setChatInput(con, text),
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(MessageBubble)));