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

function getStatusColor(remaining) {
  if (remaining.passed) return 'gray';
  if (remaining.days < 7) return 'red';
  if (remaining.days < 30) return 'yellow';
  return 'green';
}

function renderCountdowns(conferences) {
  const container = document.getElementById('countdowns');
  const deadlines = [];

  conferences.forEach(conf => {
    conf.deadlines.forEach(dl => {
      deadlines.push({
        confName: conf.name,
        description: conf.description,
        location: conf.location,
        conferenceDates: conf.dates,
        type: dl.type,
        date: dl.date
      });
    });
  });

  deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Show only upcoming + recently passed (last 7 days)
  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const filtered = deadlines.filter(dl => new Date(dl.date) > weekAgo);

  container.innerHTML = filtered.map(dl => {
    const remaining = getTimeRemaining(dl.date);
    const urgency = getUrgencyClass(remaining);
    const deadlineDateTimeStr = new Date(dl.date).toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul'
    }) + ' KST';

    return `
      <div class="countdown-card ${urgency}" data-deadline="${dl.date}">
        <div class="countdown-info">
          <div class="conf-name">${dl.confName}</div>
          <div class="conf-description">${dl.description}</div>
          <div class="conf-dates">Conference: ${dl.conferenceDates}</div>
          <div class="deadline-type">${dl.type} &mdash; ${dl.location}</div>
        </div>
        <div class="countdown-right">
          ${remaining.passed
            ? '<span class="countdown-passed-text">Deadline Passed</span>'
            : `<div class="countdown-timer">
                <div class="time-unit"><span class="number">${remaining.days}</span><span class="label">Days</span></div>
                <span class="time-separator">:</span>
                <div class="time-unit"><span class="number">${String(remaining.hours).padStart(2, '0')}</span><span class="label">Hrs</span></div>
                <span class="time-separator">:</span>
                <div class="time-unit"><span class="number">${String(remaining.minutes).padStart(2, '0')}</span><span class="label">Min</span></div>
                <span class="time-separator">:</span>
                <div class="time-unit"><span class="number">${String(remaining.seconds).padStart(2, '0')}</span><span class="label">Sec</span></div>
              </div>`
          }
          <div class="deadline-datetime">${deadlineDateTimeStr}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderFooter(lastUpdated) {
  document.getElementById('last-updated').textContent = lastUpdated;
}
