function updateSidebarUI(user) {
  if (!user) return;
  var fullName = user.firstName + ' ' + user.lastName;

  var nameEl = document.querySelector('.profile-name');
  if (nameEl) nameEl.textContent = fullName;

  var avatarCircle = document.querySelector('.avatar-circle');
  if (avatarCircle) {
    if (user.avatar) {
      avatarCircle.innerHTML = '<img src="' + user.avatar + '" alt="' + fullName + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    } else {
      var initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
      avatarCircle.style.background = '#c0c0c0';
      avatarCircle.innerHTML = '<span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:1px">' + initials + '</span>';
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var user = DMT.getCurrentUser();

  if (!user) {
    var onAuthPage = window.location.pathname.indexOf('login') !== -1 ||
                     window.location.pathname.indexOf('signup') !== -1;
    if (!onAuthPage) {
      window.location.href = 'login.html';
    }
    return;
  }

  updateSidebarUI(user);

  var signoutLink = document.querySelector('.signout');
  if (signoutLink) {
    signoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      DMT.ui.confirm('Are you sure you want to sign out?', 'Confirm Sign Out', function(isConfirmed) {
        if (isConfirmed) {
          DMT.logoutUser();
          window.location.href = 'login.html';
        }
      });
    });
  }

  // Mobile Sidebar Toggle
  var menuToggle = document.getElementById('menuToggle');
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.getElementById('mobileOverlay');

  if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.add('open');
      overlay.classList.add('open');
    });
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
});
