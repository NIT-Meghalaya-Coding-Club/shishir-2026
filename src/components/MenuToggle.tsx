"use client";

interface Props {
  isOpen: boolean;
  onClick: () => void;
}

const MenuToggle: React.FC<Props> = ({ isOpen, onClick }) => {
  const line =
    "absolute left-1/2 top-1/2 -ml-3.5 h-[3px] w-7 rounded-full bg-current " +
    "transition-transform duration-300 ease-in-out motion-reduce:transition-none";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      className="
        relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg
        text-red-800 transition-colors duration-200
        hover:bg-white/20 hover:text-red-700
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80
        dark:text-white dark:hover:bg-white/10 dark:hover:text-yellow-300
      "
    >
      <span
        aria-hidden
        className={`${line} ${
          isOpen ? "translate-y-0 rotate-45" : "-translate-y-[4px] rotate-0"
        }`}
      />
      <span
        aria-hidden
        className={`${line} ${
          isOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px] rotate-0"
        }`}
      />
    </button>
  );
};

export default MenuToggle;