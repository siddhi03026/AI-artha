function SectionCard({ title, subtitle, children, action, className = '' }) {
  return (
    <section className={`glass-panel rounded-2xl p-6 sm:p-8 ${className}`}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-textPrimary">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-textSecondary">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default SectionCard;
