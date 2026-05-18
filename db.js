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
    }
  };
})(window);