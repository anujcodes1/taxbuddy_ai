// A simple reusable "card" wrapper — keeps consistent styling across all pages
function Card({ children, className = "", hoverLift = false, style, ...rest }) {
  return (
    <div
      style={style}
      className={`bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-navy/5 p-6 md:p-8 ${
        hoverLift ? "hover:-translate-y-1" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
