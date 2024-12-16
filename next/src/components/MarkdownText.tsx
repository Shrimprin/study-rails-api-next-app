import { marked } from "marked";
import "zenn-content-css";

type MarkdownTextProps = {
  content: string;
};

const MarkdownText = (props: MarkdownTextProps) => {
  return (
    <div className="znc">
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: marked(props.content) }}
      />
    </div>
  );
};

export default MarkdownText;
