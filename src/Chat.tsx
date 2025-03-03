import {
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
  } from "@/components/ui/chat/chat-bubble";
  import { ChatInput } from "@/components/ui/chat/chat-input";
  import {
    ExpandableChat,
    ExpandableChatHeader,
    ExpandableChatBody,
    ExpandableChatFooter,
  } from "@/components/ui/chat/expandable-chat";
  import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
  import { Button } from "@/components/ui/button";
  import { Send, Paperclip, } from "lucide-react";
  import { useEffect, useRef, useState } from "react";
  import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Suggestions } from "./components/ui/chat/suggestions";
import { QuickReplyProps } from "./lib/types";
import { isString, isSuggestionsProps } from "./lib/utils";

  interface ChatMessage{
    role: "BOT" | "USER",
    type: "TEXT" | "quick_reply",
    content: string | QuickReplyProps,
  };

  

  
  export default function ChatSupport() {

    const [connection, setConnection] = useState<HubConnection | null>(null);

    const handleReplyAppend = (message: string, msgid:string) => {
      console.log(message);
      setMessages(messages => [...messages.filter(x => { 
        if(!isSuggestionsProps(x.content) )
          return true;
        if(x.content.msgid === msgid)
          return false;
        return true;
        }),{role:"USER",content:message, type:"TEXT"}])
    }

    const [messages, setMessages] = useState<ChatMessage[]>([
      {
        role:"BOT",
        content: "Hi, Welcome to our Organization",
        type:"TEXT"
      },
      {
      role:"BOT",
      type: "quick_reply",
      content:{
        append: handleReplyAppend,
        options: [
          {
            type: "text",
            postbackText: "Schedule Demo",
            title: "Schedule Demo"
          },
          {
            title: "Schedule Callback",
            type: "text",
            postbackText: "Schedule Callback"
          },
          {
            postbackText: "connect to agent",
            title: "Connect to Agent",
            type: "text"
          }
        ],
        content: {
          type: "text",
          caption: "",
          text: "Hi I'm TSPL your personal assistant. How I can help you? Select the option to procceed.",
          header: "Teckinfo Solutions Pvt. Ltd."
        },
        msgid: "qr1"
      }
    }]);
    const [input, setInput] = useState("");
    const [isLoading, setLoading] = useState(false);

    

    const handleSubmit = () => {
        if(!connection)
            return;
        connection.invoke("SendMessage", input);
        setMessages(messages => [...messages,{role:"USER",content:input, type:"TEXT"}]);
        setInput("")
    };
  
    const messagesRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
  
    useEffect(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }, [messages]);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
                    .withUrl("https://localhost:7283/announcements")
                    .withAutomaticReconnect()
                    .build();
        setConnection(newConnection);
    },[]);

    useEffect(() => {
        if(connection){
            connection.start()
            .then(() => {
                console.log("Connected to SignalR Hub");
                connection.on("ReceiveMessage", (message : string,) => {
                    setMessages(messages => [...messages,{role:"BOT",content:message,type:"TEXT"}]);
                    setLoading(false)
                })
            })
            .catch(e => console.error("Connection Failed : ",e))
        }
    },[connection])
  
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      handleSubmit();
    };
  
    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        setLoading(true);
        onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    };
  
    return (
      <ExpandableChat size="md" position="bottom-right">
        <ExpandableChatHeader className="bg-muted/60 flex-col text-center justify-center">
          <h1 className="text-xl font-semibold">Chat with our AI ✨</h1>
        </ExpandableChatHeader>
        <ExpandableChatBody>
          <ChatMessageList className="bg-muted/25" ref={messagesRef}>  
            {/* Messages */}
            {messages &&
              messages.map((message, index) => (
                <ChatBubble
                  key={index}
                  variant={message.role == "USER" ? "sent" : "received"}
                >
                  <ChatBubbleAvatar
                    src=""
                    fallback={message.role == "USER" ? "👨🏽" : "🤖"}
                  />
                  {message.type == "TEXT" && isString(message.content)  && <>
                    <ChatBubbleMessage
                      variant={message.role == "USER" ? "sent" : "received"}
                    >
                      {message.content}
                    </ChatBubbleMessage>
                  </>}
                  {message.type == "quick_reply" && isSuggestionsProps(message.content) && <>
                    <Suggestions {...message.content} />
                  </>}
                </ChatBubble>
              ))}
  
            {/* Loading */}
            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar src="" fallback="🤖" />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
          </ChatMessageList>
        </ExpandableChatBody>
        <ExpandableChatFooter className="bg-muted/25">
          <form ref={formRef} className="flex relative gap-2" onSubmit={onSubmit}>
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="min-h-12 bg-background shadow-none "
            />
            <div className="inline-flex align-middle justify-between absolute top-1/2 right-2 transform  -translate-y-1/2">
                <Button
                className="m-1"
                type="button"
                variant={"outline"}
                size="icon"
                >
                <Paperclip className="size-4" />
                </Button>
                <Button
                className="m-1"
                type="submit"
                size="icon"
                >
                <Send className="size-4" />
                </Button>
            </div>
          </form>
        </ExpandableChatFooter>
      </ExpandableChat>
    );
  }