
var ACTION_COLORS = {
  'Created':        '#95ffbc',
  'Updated':        '#91b4ff',
  'Approved':       '#69ffa0',
  'Rejected':       '#ff7e7e',
  'Routed':         '#c09cff',
  'Viewed':         '#6b7280',
  'Downloaded':     '#0891b2',
  'Archived':       '#9ca3af',
  'Status Changed': '#d97706',
  'Assigned':       '#7c3aed'
};

var STATUS_COLORS = {
  'Draft':            '#9ca3af',
  'In Transit':       '#8abeff',
  'Pending Approval': '#ffd978',
  'Approved':         '#87ff8f',
  'Rejected':         '#ff8d8d',
  'Archived':         '#d1d5db'
};

function init() {
  renderStats();
  renderRecentDocs();
  renderDistribution();
  renderActivity();
  renderDeptBars();
}

function setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderStats() {
  var s = DMT.getStats();
  setText('stat-total',   s.total);
  setText('stat-transit', s.inTransit);
  setText('stat-pending', s.pending);
  setText('stat-done',    s.approved);
}

function renderRecentDocs() {
  var docs = DMT.getDocs().slice(0, 7);
  var container = document.getElementById('recentDocsList');
  if (!container) return;

  if (!docs.length) {
    container.innerHTML = '<div class="empty-state">No documents yet. Add one from the Documents page.</div>';
    return;
  }

  container.innerHTML = docs.map(function (d) {
    return '<div class="doc-row">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" style="flex-shrink:0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
      '<div class="doc-info">' +
        '<div class="doc-name">' + d.name + '</div>' +
        '<div class="doc-meta">' + d.id + ' &nbsp;|&nbsp; ' + d.date + '</div>' +
      '</div>' +
      '<div class="doc-badges">' + statusBadge(d.status) + '&nbsp;' + priorityBadge(d.priority) + '</div>' +
    '</div>';
  }).join('');
}

function renderDistribution() {
  var s     = DMT.getStats();
  var total = s.total;
  var svg    = document.getElementById('donutSvg');
  var legend = document.getElementById('donutLegend');
  if (!svg || !legend) return;

  var slices = [
    { label: 'Approved',         value: s.approved,  color: STATUS_COLORS['Approved'] },
    { label: 'In Transit',       value: s.inTransit, color: STATUS_COLORS['In Transit'] },
    { label: 'Pending Approval', value: s.pending,   color: STATUS_COLORS['Pending Approval'] },
    { label: 'Draft',            value: s.draft,     color: STATUS_COLORS['Draft'] },
    { label: 'Rejected',         value: s.rejected,  color: STATUS_COLORS['Rejected'] }
  ].filter(function (sl) { return sl.value > 0; });

  if (!total) {
    svg.innerHTML = '<circle cx="18" cy="18" r="13" fill="none" stroke="#e5e7eb" stroke-width="5"/><circle cx="18" cy="18" r="8" fill="white"/>';
    legend.innerHTML = '<div class="legend-row" style="grid-column:span 2;justify-content:center;font-size:12px">No data yet</div>';
    return;
  }

  var cx = 18, cy = 18, r = 13;
  var circumference = 2 * Math.PI * r;
  var cumulative = 0;
  var paths = '';

  slices.forEach(function (sl) {
    var dash   = (sl.value / total) * circumference;
    var gap    = circumference - dash;
    var rotate = (cumulative / total) * 360 - 90;
    paths += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none"' +
      ' stroke="' + sl.color + '" stroke-width="5"' +
      ' stroke-dasharray="' + dash.toFixed(3) + ' ' + gap.toFixed(3) + '"' +
      ' transform="rotate(' + rotate.toFixed(2) + ' ' + cx + ' ' + cy + ')"/>';
    cumulative += sl.value;
  });

  paths += '<circle cx="18" cy="18" r="9" fill="white"/>';
  svg.innerHTML = paths;

  legend.innerHTML = slices.map(function (sl) {
    return '<div class="legend-row"><span class="dot" style="background:' + sl.color + '"></span>' + sl.label + '</div>';
  }).join('');
}

function renderActivity() {
  var logs = DMT.getLogs().slice(0, 10);
  var container = document.getElementById('recentActivityList');
  if (!container) return;

  if (!logs.length) {
    container.innerHTML = '<div class="empty-state">No activity yet. Add a document to see recent actions here.</div>';
    return;
  }

  container.innerHTML = logs.map(function (l) {
    var color = ACTION_COLORS[l.action] || '#6b7280';
    return '<div class="activity-row">' +
      '<div class="activity-dot" style="background:' + color + '"></div>' +
      '<div class="activity-info">' +
        '<div class="activity-main">' +
          '<strong>' + l.email + '</strong> ' + l.action.toLowerCase() + ' ' +
          '<span class="activity-docid">' + l.docId + '</span>' +
        '</div>' +
        '<div class="activity-sub">' + l.details + '</div>' +
      '</div>' +
      '<div class="activity-time">' + l.timestamp + '</div>' +
    '</div>';
  }).join('');
}

function renderDeptBars() {
  var s = DMT.getStats();
  var container = document.getElementById('deptBars');
  if (!container) return;

  var entries = Object.keys(s.byDept).map(function (k) {
    return { dept: k, count: s.byDept[k] };
  }).sort(function (a, b) { return b.count - a.count; });

  if (!entries.length) {
    container.innerHTML = '<div class="empty-state">No data yet.</div>';
    return;
  }

  var max = entries[0].count;

  container.innerHTML = entries.map(function (e) {
    var pct  = Math.round((e.count / max) * 100);
    var name = e.dept.length > 24 ? e.dept.slice(0, 24) + '\u2026' : e.dept;
    return '<div class="dept-bar-item">' +
      '<div class="dept-bar-label"><span>' + name + '</span><span>' + e.count + '</span></div>' +
      '<div class="dept-bar-track"><div class="dept-bar-fill" style="width:' + pct + '%"></div></div>' +
    '</div>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', init);
