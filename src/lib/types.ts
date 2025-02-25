export interface QuickReplyProps {
    append: (message:string, msgid:string) => void
    options: ReplyOption[],
    content: ReplyContent,
    msgid: string
  }

  export interface ReplyOption{
    type: "text",
    postbackText: string,
    title: string
  }

  export interface ReplyContent{
    type:"text",
    caption:string,
    text:string,
    header:string
  }