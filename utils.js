

function statusBadge(status) {
  var map = {
    'Draft':            { bg: '#f3f4f6', color: '#374151' },
    'In Transit':       { bg: '#dbeafe', color: '#93b0ff' },
    'Pending Approval': { bg: '#fef3c7', color: '#7f5b00' },
    'Approved':         { bg: '#dcfce7', color: '#9dffc1' },
    'Rejected':         { bg: '#fee2e2', color: '#ff9191' },
    'Archived':         { bg: '#f3f4f6', color: '#9ca3af' }
  };
  var s = map[status] || { bg: '#f3f4f6', color: '#374151' };
  return '<span style="display:inline-block;font-size:11px;font-weight:600;padding:2px 9px;border-radius:4px;background:' + s.bg + ';color:' + s.color + '">' + (status || '—') + '</span>';
}

function priorityBadge(priority) {
  var map = {
    'Low':    { bg: '#dcfce7', color: '#15803d' },
    'Normal': { bg: '#dbeafe', color: '#1d4ed8' },
    'Urgent': { bg: '#fee2e2', color: '#dc2626' }
  };
  var s = map[priority] || { bg: '#f3f4f6', color: '#374151' };
  return '<span style="display:inline-block;font-size:11px;font-weight:600;padding:2px 9px;border-radius:4px;background:' + s.bg + ';color:' + s.color + '">' + (priority || '—') + '</span>';
}

function actionBadge(action) {
  var map = {
    'Created':        { bg: '#dbeafe', color: '#1d4ed8' },
    'Updated':        { bg: '#e0e7ff', color: '#4338ca' },
    'Approved':       { bg: '#dcfce7', color: '#15803d' },
    'Rejected':       { bg: '#fee2e2', color: '#dc2626' },
    'Routed':         { bg: '#fef9c3', color: '#854d0e' },
    'Viewed':         { bg: '#f3f4f6', color: '#374151' },
    'Downloaded':     { bg: '#cffafe', color: '#0e7490' },
    'Archived':       { bg: '#f3f4f6', color: '#9ca3af' },
    'Status Changed': { bg: '#fef3c7', color: '#b45309' },
    'Assigned':       { bg: '#ede9fe', color: '#7c3aed' }
  };
  var s = map[action] || { bg: '#f3f4f6', color: '#374151' };
  return '<span style="display:inline-block;font-size:11px;font-weight:600;padding:2px 9px;border-radius:4px;background:' + s.bg + ';color:' + s.color + '">' + (action || '—') + '</span>';
}
