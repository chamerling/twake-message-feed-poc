import { Component } from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

export type MessageModel = {
  id: number,
  date: string,
  index: number,
  name: string,
  initials: string,
  content: string,
  longContent: string,
};

type Props = {
  index: number;
  message: MessageModel;
  removeMessage: (message: MessageModel) => void;
  editMessage: (message: MessageModel) => void;
};

export default class Message extends Component<Props> {

  render() {
    return (
      <div className="message" style={{minHeight: "100px"}}>
        <div style={{marginLeft: '1rem', display: 'flex', alignItems: 'center'}}>
          <Avatar style={{marginRight: '1rem'}} alt={this.props.message.initials}>{this.props.message.initials}</Avatar>
          <span>{`${this.props.message.name} - ${this.props.message.date}`}</span>
          <IconButton aria-label="delete" onClick={() => this.props.removeMessage(this.props.message)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="edit" onClick={() => this.props.editMessage(this.props.message)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
        <ListItem alignItems="flex-start">
          <ListItemText
            secondary={<span>{this.props.message.longContent}</span>}
            />
        </ListItem>
      </div>
    );
  }
};
