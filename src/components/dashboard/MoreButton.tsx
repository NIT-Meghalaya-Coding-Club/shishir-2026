"use client";

const MoreButton = () => {
  const handleScroll = () => {
    const section = document.getElementById("more-info-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={handleScroll}
      className="px-4 py-3 text-lg font-mono font-semibold text-gray-700 bg-white rounded-md shadow-md transition-all duration-200
                 hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:shadow-inner focus:outline-none"
    >
      More Info
    </button>
  );
};

export default MoreButton;
