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
      }
    }
  };
})(window);