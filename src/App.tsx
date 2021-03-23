import { useState, useCallback, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import faker from "faker";

const START_INDEX = 10000;
const PAGE_SIZE = 20;
let id = 0;

type Message = {
  id: number,
  date: string,
  index: number,
  name: string,
  initials: string,
  content: string,
  longContent: string,
};

function message(index = 0): Message {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  return {
    id: ++id,
    date: new Date().toLocaleString(),
    index: index + 1,
    name: `${firstName} ${lastName}`,
    initials: `${firstName.substr(0, 1)}${lastName.substr(0, 1)}`,
    content: faker.lorem.sentence(10),
    longContent: faker.lorem.paragraphs(Math.floor(1 + Math.random() * 5)),
  };
}

const generateMessages = (length: number, startIndex = 0) => {
  return Array.from({ length }).map((_, i) => message(i + startIndex))
}

function App() {
  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);
  const [lastItemIndex, setLastItemIndex] = useState(START_INDEX + PAGE_SIZE);
  const [messages, setMessages] = useState(() => generateMessages(PAGE_SIZE, START_INDEX));
  const virtuosoRef = useRef(null)

  const prependItems = useCallback(() => {
    console.log("Loading messages up");
    const messagesToPrepend = PAGE_SIZE;
    const nextFirstItemIndex = firstItemIndex - messagesToPrepend;

    setTimeout(() => {
      console.log("Up messages loaded");
      setFirstItemIndex(() => nextFirstItemIndex)
      setMessages(() => [...generateMessages(messagesToPrepend, nextFirstItemIndex), ...messages])
    }, 500);

    return false
  }, [firstItemIndex, messages, setMessages]);

  const addMessage = () => {
    const nextLastItemIndex = lastItemIndex + 1;
    console.log("Add message", nextLastItemIndex);
    setLastItemIndex(() => nextLastItemIndex);
    setMessages(() => [...messages, ...generateMessages(1, nextLastItemIndex)]);
    (virtuosoRef.current as any).scrollToIndex({
      index: nextLastItemIndex,
      behavior: "smooth",
    });
  };

  const goToBottom = () => {
    (virtuosoRef.current as any).scrollToIndex({
      index: lastItemIndex,
      behavior: "smooth"
    })
  };

  const removeMessage = (message: Message) => {
    console.log("Remove message", message);
    const updatedMessages = messages.filter(m => m.id !== message.id);
    setMessages(() => [...updatedMessages]);
  };

  const editMessage = (message: Message) => {
    const messageToEdit = messages.find(m => m.id === message.id);
    console.log(messageToEdit);
    messageToEdit && (messageToEdit.longContent = faker.lorem.paragraph(10));
    setMessages(() => [...messages]);
  };

  return (
    <>
      <List>
        <Virtuoso
          ref={virtuosoRef}
          style={{width: '100%', height: '80vh'}}
          onScroll={e => console.log("Scrolltop", (e.target as any).scrollTop)}
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={PAGE_SIZE - 1}
          data={messages}
          startReached={prependItems}
          isScrolling={(scrolling) => console.log("is scrolling", scrolling)}
          itemContent={(_index, message) => {
            return (
              <>
              <div style={{marginLeft: '1rem', display: 'flex', alignItems: 'center'}}>
                <Avatar style={{marginRight: '1rem'}} alt={message.initials}>{message.initials}</Avatar>
                <span>{`${message.name} - ${message.date}`}</span>
                <IconButton aria-label="delete" onClick={() => removeMessage(message)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="edit" onClick={() => editMessage(message)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </div>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    secondary={<span>{message.longContent}</span>}
                  />
                </ListItem>
              </>
            );
          }}
          atBottomStateChange={(atBottom) => {
            console.log("At bottom", atBottom);
          }}
          atTopStateChange={(atTop) => {
            console.log("At top", atTop);
          }}
          components={{
            Header: () => {
              return (
                <div
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                  }}>
                    <CircularProgress color="secondary"/>
                </div>
              );
            },
          }}
        />
      </List>
      <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'center'}}>
        <Button onClick={addMessage} color="primary">Add message</Button>
        <Button onClick={goToBottom} color="primary">Bottom</Button>
      </div>
    </>
  );
};

export default App;
