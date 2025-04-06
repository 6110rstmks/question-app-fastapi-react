import React from 'react';

// memo内のURLのみを<a>タグに変換する関数
// これを使うことで、memo内のURLをクリック可能にする
const RenderMemoWithLinks = (memo: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
  
    // memo内の各行に対してリンクを処理
    return memo.split('\n').map((line, index) => {
      // URLを検出して<a>タグに変換
      const parts = line.split(urlRegex);
      return (
        <React.Fragment key={index}>
          {parts.map((part, i) => {
            // URLなら<a>タグをレンダリング、それ以外はそのまま表示
            if (urlRegex.test(part)) {
              return (
                <a key={i} href={part} target="_blank" rel="noopener noreferrer">
                  {part}
                </a>
              );
            }
            return part;
          })}
          <br />
        </React.Fragment>
      );
    });
};

export default RenderMemoWithLinks;