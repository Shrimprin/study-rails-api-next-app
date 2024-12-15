type ArticleCardProps = {
  title: string;
  fromToday: string;
  userName: string;
};

const omit = (text: string) => (len: number) => (ellipsis: string) =>
  text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text;

const ArticleCard = (props: ArticleCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="p-4">
        <h3 className="mb-2 min-h-[48px] text-lg font-bold leading-tight">
          {omit(props.title)(45)("...")}
        </h3>
        <div className="flex justify-between">
          <p className="text-xs">{props.userName}</p>
          <p className="text-xs">{props.fromToday}</p>
        </div>
      </div>
    </div>
  );
};
export default ArticleCard;
