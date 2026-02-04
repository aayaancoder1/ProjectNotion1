


import { fetchFromNotion } from "../core/notion/readData";
import { getThisWeekTasks, getUpcomingTasks, getAtRiskTasks } from "../core/views/dashboardViews";

export const revalidate = 0; // Disable caching for now

export default async function Home() {
  const { courses, tasks } = await fetchFromNotion();
  const now = new Date();

  const thisWeek = getThisWeekTasks(tasks, now);
  const upcoming = getUpcomingTasks(tasks);
  const atRisk = getAtRiskTasks(tasks, courses);

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Student OS Dashboard</h1>

      <section>
        <h2>This Week</h2>
        {thisWeek.length === 0 ? <p>No tasks due this week.</p> : (
          <ul>
            {thisWeek.map(t => (
              <li key={t.id}>{t.name} — {t.status} — {new Date(t.dueDate).toLocaleDateString()} ({t.priority})</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>At Risk (High Impact)</h2>
        {atRisk.length === 0 ? <p>No high-stakes tasks pending.</p> : (
          <ul>
            {atRisk.map(t => (
              <li key={t.id} style={{ color: 'red' }}>
                {t.name} (Course Credits: {courses.find(c => c.id === t.courseId)?.credits}) — Due {new Date(t.dueDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>All Upcoming</h2>
        {upcoming.length === 0 ? <p>No upcoming tasks.</p> : (
          <details>
            <summary>View All ({upcoming.length})</summary>
            <ul>
              {upcoming.map(t => (
                <li key={t.id}>{t.name} — {t.status} — {new Date(t.dueDate).toLocaleDateString()}</li>
              ))}
            </ul>
          </details>
        )}
      </section>
    </main>
  );
}
