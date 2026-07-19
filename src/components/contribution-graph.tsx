import type { ContributionCalendar } from "@/lib/activity";
import { TextLink } from "@/components/ui/text-link";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ContributionGraph({
  calendar,
  label,
  href,
}: {
  calendar: ContributionCalendar;
  label: string;
  href: string;
}) {
  const { days, total, longestStreak } = calendar;
  type Cell = ContributionCalendar["days"][number] | undefined;
  const weeks: Cell[][] = [];
  const firstDay = new Date(`${days[0]?.date}T00:00:00Z`).getUTCDay();
  let week: Cell[] = new Array<Cell>(firstDay).fill(undefined);
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) weeks.push(week);

  const monthLabels = weeks.map((w, wi) => {
    const first = w.find(Boolean);
    if (!first) return null;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (wi === 0) return null;
    const prev = weeks[wi - 1]?.find(Boolean);
    if (!prev) return null;
    const prevMonth = new Date(`${prev.date}T00:00:00Z`).getUTCMonth();
    return month !== prevMonth ? MONTHS[month] : null;
  });

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-medium text-ink">
          <TextLink href={href} variant="ink">
            {label}
          </TextLink>
        </h3>
        <p className="text-xs text-muted">
          {total.toLocaleString()} contribution{total === 1 ? "" : "s"} in the last year
          {longestStreak > 1 ? ` · ${longestStreak}-day best streak` : ""}
        </p>
      </div>
      {/* dir="rtl" anchors the initial scroll position to the right (most recent
          weeks) without JS; the inner dir="ltr" restores normal layout order. */}
      <div className="mt-3 overflow-x-auto" dir="rtl">
        <div dir="ltr" style={{ minWidth: "40rem" }}>
          <div className="flex gap-[3px]" aria-hidden>
            {weeks.map((_, wi) => (
              <div key={wi} className="relative h-4 flex-1">
                {monthLabels[wi] ? (
                  <span className="absolute left-0 whitespace-nowrap text-[10px] leading-4 text-muted">
                    {monthLabels[wi]}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <div className="contrib flex gap-[3px]">
            {weeks.map((w, wi) => (
              <div key={wi} className="flex flex-1 flex-col gap-[3px]">
                {Array.from({ length: 7 }, (_, di) => {
                  const d = w[di];
                  if (!d) return <div key={di} className="aspect-square" />;
                  return (
                    <div
                      key={di}
                      className={`contrib-d aspect-square rounded-[2px]${d.level > 0 ? ` l${d.level}` : ""}`}
                      title={`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
