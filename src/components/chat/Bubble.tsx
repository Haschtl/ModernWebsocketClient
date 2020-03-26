import React, { ReactText } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { actions, RootState } from '../../store';
import { Message, Connection } from '../../store/connections/types'
import {
  IonItemDivider
} from '@ionic/react';
import JSONTree from 'react-json-tree'
import * as Cres from '../../parser/message';
import { type } from 'os';

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

  cres2json(str: string) {
    const strsplit = str.split('::')
    var sender = undefined
    var message = undefined
    var value = undefined
    if (strsplit.length === 3) {
      sender = strsplit[0]
      message = strsplit[1] //.split(':')
      value = strsplit[2]
      return { "sender": sender, "message": message, "value": value }
    }
    else if (strsplit.length === 2) {
      sender = strsplit[0]
      message = strsplit[1] //.split(':')
      return { "sender": sender, "message": message }
    }
    else if (strsplit.length === 1) {
      var strsplit2 = str.split(':')
      strsplit2 = [strsplit2[0],strsplit2.slice(1,strsplit2.length).join(':')]
      
      if (strsplit2.length === 2) {
        // console.log(strsplit2)
        // console.log(strsplit2[1].split('='))
        if(strsplit2[1].indexOf('(')>=0){
          return { "target": strsplit2[0], 
          "call": strsplit2[1].slice(0,strsplit2[1].indexOf('(')),
          "arguments": strsplit2[1].slice(strsplit2[1].indexOf('(')+1,strsplit2[1].indexOf(')')+1-strsplit2[1].indexOf('(')).split(',')
          }
        }
        else if(strsplit2[1].split('=').length>=2){
          return { "target": strsplit2[0], 
          "set": strsplit2[1].slice(0,strsplit2[1].indexOf('=')), 
          "value": strsplit2[1].slice(strsplit2[1].indexOf('=')+1,strsplit2[1].length)}
        }
        else if(strsplit2[1].indexOf(':')>=0){
          return { "target": strsplit2[0], "get": strsplit2[1]}
        }
        else{return undefined}
      }
      else{
        return undefined
      }
    }
    else { return undefined }
  }

  shouldExpandNode(keyName:ReactText[], data:any, level:number) {
    if (typeof(keyName[0]) === "number") {
      return true
    }
    var expanded: string[]= ["commands","path","ret_values"]
    if (expanded.indexOf(keyName[0])>=0){
    return true
  }
  else {
    return false
  }
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
    var json:any= undefined;
    // var cmd:any= {};
    if(this.props.connection.beautify===true){
    try {
      json = JSON.parse(text)
    }
    catch{
      try {
        json = new Cres.Message(text, false).toJSON(false,false, true, true, true, true, true, true, false, false)
        
        // json.commands.
        // console.log(json)
      }
      catch (e){
        console.warn(e)
        // try {
        //   json = this.cres2json(text)
        //   // console.log(json)
        // }
        // catch (e){
        //   // console.log(e)
        //  }
       }
    }}
    return (<>
      {this.props.idx % 5 === 0 &&
        <IonItemDivider sticky style={{ textAlign: 'center' }}>
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
                shouldExpandNode={(keyName:ReactText[], data:any, level:number)=>this.shouldExpandNode(keyName,data,level)}
                theme={{ tree: (style: any) => ({ style: { ...style, backgroundColor: undefined }, className: className2 }), }}
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