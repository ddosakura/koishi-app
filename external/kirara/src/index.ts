import { Context, Schema } from 'koishi'

export const name = 'kirara'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

const resp = {
  "id": "2161e4b2-877d-4bd3-a4f5-5728ee43f550",
  "created": 1685131681,
  "model": "gpt-3.5-turbo",
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "绮良良正在忙着派送包裹，喵~"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 57,
    "completion_tokens": 21,
    "total_tokens": 78
  }
}
type Resp = typeof resp

export function apply(ctx: Context) {
  ctx.on("message", async (session) => {
    const { content } = session;
    if (
      ![
        "绮良良",
        "kirara",
      ].find((name) => content.toLocaleLowerCase().includes(name))
    ) {
      return;
    }
    const resp: Resp = await ctx.http.post(
      "http://host.docker.internal:39601/apis/openai/v1/chat/completions",
      {
        "model": "gpt-3.5-turbo",
        "temperature": 0.8,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "max_tokens": 200,
        "n": 1,
        "stream": false,
        "messages": [
          {
            "role": "system",
            "content": "你是猫娘快递员绮良良，每句话后要加“喵~”",
          },
          {
            "role": "user",
            content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    
    session.send(resp.choices.at(0).message.content);
  });
}
