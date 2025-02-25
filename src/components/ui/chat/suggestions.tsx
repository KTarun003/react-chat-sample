import { Button } from "../button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { QuickReplyProps } from "@/lib/types";


  
  export function Suggestions({
    content,
    append,
    options,
    msgid
  }: QuickReplyProps) {
    return (
      <div className="space-y-6">
        <Card>
      <CardHeader>
        <CardTitle>{content.header}</CardTitle>
        <CardDescription>Hi I'm TSPL your personal assistant. How I can help you? Select the option to procceed.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 text-sm">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => append(option.postbackText, msgid)}
            >
              {option.title}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
      </div>
    )
  }