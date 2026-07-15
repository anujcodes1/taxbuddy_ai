// A single reusable header for every feature page: gradient icon badge,
// title, and subtitle, with a gentle entrance animation.
// Keeping this in one place means every page picks up UI improvements for free.
function PageHeader({ icon, title, subtitle }) {
  return (
    <div className="text-center mb-10 animate-fade-in-up">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy to-navy-light text-cream flex items-center justify-center text-2xl mx-auto mb-4 shadow-card">
        {icon}
      </div>
      <h1 className="text-3xl font-heading font-bold text-navy-dark">{title}</h1>
      {subtitle && <p className="text-navy/60 mt-2 max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

export default PageHeader;
