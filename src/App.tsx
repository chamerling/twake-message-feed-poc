import { useState, useCallback, useRef, useEffect } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import MessageItem from './components/Message';

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
  const [showBottomButton, setShowBottomButton] = useState(false);
  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);
  const [lastItemIndex, setLastItemIndex] = useState(START_INDEX + PAGE_SIZE);
  const [messages, setMessages] = useState(() => generateMessages(PAGE_SIZE, START_INDEX));
  useEffect(() => {
    document.title = `${messages.length} messages`;
  }, [messages]);
  const virtuosoRef = useRef<VirtuosoHandle>(null)

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
    virtuosoRef.current?.scrollToIndex({
      index: nextLastItemIndex,
      behavior: "smooth",
    });
  };

  const goToBottom = () => {
    virtuosoRef.current?.scrollToIndex({
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
        <div style={{height: "500px"}}>
        <Virtuoso
          ref={virtuosoRef}
          overscan={1000}
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={PAGE_SIZE - 1}
          data={messages}
          startReached={prependItems}
          isScrolling={(scrolling) => console.log("is scrolling", scrolling)}
          itemContent={(index: number, message: Message) => {
            return (
              <MessageItem index={index} message={message} removeMessage={removeMessage} editMessage={editMessage}></MessageItem>
            );
          }}
          atBottomStateChange={(atBottom) => {
            console.log("At bottom", atBottom);
            setShowBottomButton(!atBottom);
          }}
          atTopStateChange={(atTop) => {
            console.log("At top", atTop);
          }}
          components={{
            Header: () => {
              return (
                <div
                style={{
                    // Looks like adding the padding/margin makes things dirty when scrolling up
                    // (There is some blank stuff before element is rendered)
                    // it may be better to handle this from an external component
                    //padding: '2rem',
                    //marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  >
                    <CircularProgress color="secondary"/>
                </div>
              );
            },
          }}
        />
      </div>
      </List>
      <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'center'}}>
        <Button onClick={addMessage} color="primary">Add message</Button>
        { showBottomButton && (<Button onClick={goToBottom} color="primary">Bottom</Button>) }
      </div>
    </>
  );
};

export default App;
