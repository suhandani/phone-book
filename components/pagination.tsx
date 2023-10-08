type Props = {
  items: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ items, pageSize, currentPage, onPageChange }: Props) => {
  const pagesCount = Math.ceil(items / pageSize);

  if (pagesCount === 1) return null;
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-row mt-6">
      {pages.map((page) => (
        <button
          key={page}
          className={`p-2 pr-5 pl-5 mx-2 rounded ${
            page === currentPage ? "bg-slate-500" : "bg-[#ccc]"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
