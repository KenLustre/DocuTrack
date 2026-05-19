(function (global) {
  var
  DOCS_KEY = 'dmt_docs',
  LOGS_KEY = 'dmt_logs',
  USERS_KEY = 'dmt_users',
  SESSION_KEY = 'dmt_session';

  function save(k, d) { localStorage.setItem(k, JSON.stringify(d)); }
  function load(k) { return JSON.parse(localStorage.getItem(k) || '[]'); }

  global.DMT = {
    getCurrentUser: function() {
      var s = JSON.parse(localStorage.getItem(SESSION_KEY));
      return s ? load(USERS_KEY).find(u => u.id === s.id) : null;
    },
    isLoggedIn: function() { return !!this.getCurrentUser(); },
    logoutUser: function() { localStorage.removeItem(SESSION_KEY); },
    
    getUserDocs: function(userId) {
      return load(DOCS_KEY).filter(d => d.ownerId === userId);
    },
    
    registerUser: function (data) {
      var users = load(USERS_KEY);
      var exists = users.find(function(u) { return u.email === data.email; });
      if (exists) return { ok: false, message: 'An account with that email already exists.' };

      var user = {
        id:        'USR-' + Math.floor(1000 + Math.random() * 9000),
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        password:  data.password,
        avatar:    data.avatar || null,
        phone:     '',
        createdAt: Date.now()
      };
      users.push(user);
      save(USERS_KEY, users);
      save(SESSION_KEY, { id: user.id });
      return { ok: true };
    },

    loginUser: function (email, password) {
      var user = load(USERS_KEY).find(function(u) {
        return u.email === email && u.password === password;
      });
      if (!user) return null;
      save(SESSION_KEY, { id: user.id });
      return user;
    },

    addDoc: function (data, user) {
      var docs = load(DOCS_KEY);
      var doc = {
        id: 'DMT-' + Math.floor(1000 + Math.random() * 9000),
        ownerId: user.id,
        name: data.title,
        type: data.type || 'Other',
        status: 'Pending Approval',
        date: new Date().toLocaleDateString('en-US'),
        createdAt: Date.now()
      };
      docs.unshift(doc);
      save(DOCS_KEY, docs);
      
      var logs = load(LOGS_KEY);
      logs.unshift({ email: user.email, action: 'Created', docId: doc.id, details: `Uploaded ${doc.name}`, timestamp: new Date().toLocaleString() });
      save(LOGS_KEY, logs);
      return doc;
    },

    ui: {
      _createModal: function(title, message, buttons) {
        var existingModal = document.querySelector('.msg-modal-overlay');
        if (existingModal) {
          existingModal.remove();
        }

        var modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay msg-modal-overlay open';

        var modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.maxWidth = '400px';
        modal.style.textAlign = 'center';

        var modalHead = document.createElement('div');
        modalHead.className = 'modal-head';
        var modalTitle = document.createElement('h3');
        modalTitle.textContent = title;
        modalHead.appendChild(modalTitle);

        var modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.style.padding = '8px 0 20px';
        var modalMessage = document.createElement('p');
        modalMessage.textContent = message;
        modalMessage.style.fontSize = '14px';
        modalMessage.style.color = 'var(--muted)';
        modalMessage.style.lineHeight = '1.5';
        modalBody.appendChild(modalMessage);

        var modalFoot = document.createElement('div');
        modalFoot.className = 'modal-foot';
        modalFoot.style.display = 'flex';
        modalFoot.style.justifyContent = 'center';
        modalFoot.style.gap = '12px';
        
        buttons.forEach(function(btn) {
          var buttonEl = document.createElement('button');
          buttonEl.textContent = btn.text;
          buttonEl.className = btn.class;
          buttonEl.onclick = function() {
            modalOverlay.remove();
            if (btn.callback) btn.callback();
          };
          modalFoot.appendChild(buttonEl);
        });

        modal.appendChild(modalHead);
        modal.appendChild(modalBody);
        modal.appendChild(modalFoot);
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
      },
      alert: function(message, title) {
        this._createModal(title || 'Alert', message, [{ text: 'OK', class: 'btn-blue' }]);
      },
      confirm: function(message, title, onConfirm) {
        this._createModal(title || 'Confirm', message, [
          { text: 'Cancel', class: 'btn-outline', callback: function() { onConfirm(false); } },
          { text: 'Confirm', class: 'btn-outline btn-danger-hover', callback: function() { onConfirm(true); } }
        ]);
      },
      toast: function(title, message, type) {
        if (!document.getElementById('dmt-toast-styles')) {
          var style = document.createElement('style');
          style.id = 'dmt-toast-styles';
          style.textContent = `
            .dmt-toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 12px; pointer-events: none; }
            .dmt-toast { background: #fff; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 16px 20px; width: 340px; max-width: calc(100vw - 48px); border-left: 4px solid #3b82f6; display: flex; align-items: flex-start; gap: 14px; pointer-events: auto; animation: toastSlideIn 0.35s cubic-bezier(0.2, 1, 0.3, 1) forwards; transition: opacity 0.3s, transform 0.3s; font-family: var(--font, sans-serif); }
            .dmt-toast.success { border-left-color: #10b981; }
            .dmt-toast.error { border-left-color: #ef4444; }
            .dmt-toast-content { flex: 1; }
            .dmt-toast-title { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px; }
            .dmt-toast-msg { font-size: 13px; color: #6b7280; line-height: 1.4; }
            .dmt-toast-close { background: none; border: none; color: #9ca3af; cursor: pointer; padding: 2px; line-height: 1; margin-top: -2px; border-radius: 4px; transition: color 0.15s, background 0.15s; }
            .dmt-toast-close:hover { color: #374151; background: #f3f4f6; }
            @keyframes toastSlideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            .dmt-toast.hiding { opacity: 0; transform: translateX(100%); }
            @media (max-width: 600px) { .dmt-toast-container { bottom: 16px; right: 16px; left: 16px; align-items: center; } .dmt-toast { width: 100%; max-width: 100%; } }
          `;
          document.head.appendChild(style);
        }

        var container = document.querySelector('.dmt-toast-container');
        if (!container) {
          container = document.createElement('div');
          container.className = 'dmt-toast-container';
          document.body.appendChild(container);
        }

        var toast = document.createElement('div');
        toast.className = 'dmt-toast ' + (type || '');
        
        var content = document.createElement('div');
        content.className = 'dmt-toast-content';
        content.innerHTML = '<div class="dmt-toast-title">' + title + '</div><div class="dmt-toast-msg">' + message + '</div>';

        var closeBtn = document.createElement('button');
        closeBtn.className = 'dmt-toast-close';
        closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        
        toast.appendChild(content);
        toast.appendChild(closeBtn);
        container.appendChild(toast);

        var removeToast = function() { toast.classList.add('hiding'); setTimeout(function() { if(toast.parentNode) toast.remove(); }, 300); };
        closeBtn.onclick = removeToast;
        setTimeout(removeToast, 4500);
      }
    }
  };
})(window);