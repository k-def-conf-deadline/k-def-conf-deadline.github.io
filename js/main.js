document.addEventListener('DOMContentLoaded', () => {
  const data = CONFERENCE_DATA;
  renderCountdowns(data.conferences);
  renderFooter(data.lastUpdated);
  setInterval(() => renderCountdowns(data.conferences), 1000);
});

function getTimeRemaining(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;

  if (diff <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { total: diff, days, hours, minutes, seconds, passed: false };
}

function getUrgencyClass(remaining) {
  if (remaining.passed) return 'passed';
  if (remaining.days < 7) return 'imminent';
  if (remaining.days < 30) return 'urgent';
  return '';
}

function getConferenceInfo(conf) {
  const deadlinesWithStatus = conf.deadlines.map(dl => ({
    type: dl.type,
    date: dl.date,
    remaining: getTimeRemaining(dl.date),
    dateObj: new Date(dl.date)
  }));

  const upcoming = deadlinesWithStatus.filter(d => !d.remaining.passed)
    .sort((a, b) => a.dateObj - b.dateObj);
  const passed = deadlinesWithStatus.filter(d => d.remaining.passed)
    .sort((a, b) => b.dateObj - a.dateObj);

  const orderedDeadlines = [...upcoming, ...passed];
  const primaryDeadline = upcoming.length > 0 ? upcoming[0] : passed[0];
  const allPassed = upcoming.length === 0;

  return { conf, orderedDeadlines, primaryDeadline, allPassed };
}

function renderConferenceCard(info) {
  const { conf, orderedDeadlines, primaryDeadline, allPassed } = info;
  const urgency = getUrgencyClass(primaryDeadline.remaining);

  const deadlineListHTML = orderedDeadlines.map(dl => {
    const isPassed = dl.remaining.passed;
    const dateStr = new Date(dl.date).toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul'
    }) + ' KST';

    return `<div class="deadline-item${isPassed ? ' deadline-passed' : ''}">
      <span class="deadline-item-type">${dl.type}</span>
      <span class="deadline-item-date">${dateStr}</span>
    </div>`;
  }).join('');

  const remaining = primaryDeadline.remaining;

  return `
    <div class="countdown-card ${urgency}">
      <div class="countdown-info">
        <div class="conf-name">${conf.name}</div>
        <div class="conf-description">${conf.description}</div>
        <div class="conf-dates">${conf.location} &mdash; ${conf.dates}</div>
        <div class="deadline-list">
          ${deadlineListHTML}
        </div>
      </div>
      <div class="countdown-right">
        ${allPassed
          ? '<span class="countdown-passed-text">All Deadlines Passed</span>'
          : `<div class="countdown-label">Next: ${primaryDeadline.type}</div>
             <div class="countdown-timer">
               <div class="time-unit"><span class="number">${remaining.days}</span><span class="label">Days</span></div>
               <span class="time-separator">:</span>
               <div class="time-unit"><span class="number">${String(remaining.hours).padStart(2, '0')}</span><span class="label">Hrs</span></div>
               <span class="time-separator">:</span>
               <div class="time-unit"><span class="number">${String(remaining.minutes).padStart(2, '0')}</span><span class="label">Min</span></div>
               <span class="time-separator">:</span>
               <div class="time-unit"><span class="number">${String(remaining.seconds).padStart(2, '0')}</span><span class="label">Sec</span></div>
             </div>`
        }
      </div>
    </div>
  `;
}

function renderCountdowns(conferences) {
  const container = document.getElementById('countdowns');
  const confInfos = conferences.map(getConferenceInfo);

  confInfos.sort((a, b) => {
    if (a.allPassed && !b.allPassed) return 1;
    if (!a.allPassed && b.allPassed) return -1;
    return a.primaryDeadline.dateObj - b.primaryDeadline.dateObj;
  });

  container.innerHTML = confInfos.map(renderConferenceCard).join('');
}

function renderFooter(lastUpdated) {
  document.getElementById('last-updated').textContent = lastUpdated;
}
