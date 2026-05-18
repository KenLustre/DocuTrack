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
      avatarCircle.innerHTML =
        '<span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:1px">' + initials + '</span>';
    }
  }

  var signoutLink = document.querySelector('.signout');
  if (signoutLink) {
    signoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      DMT.logoutUser();
      window.location.href = 'login.html';
    });
  }

  function updateSidebarUI(user) {
  var nameEl = document.querySelector('.profile-name');
  var avatarCircle = document.querySelector('.avatar-circle');
  
  if (nameEl) nameEl.textContent = user.firstName + ' ' + user.lastName;

  if (avatarCircle) {
    if (user.avatar) {
      avatarCircle.innerHTML = `<img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      var initials = (user.firstName[0] + user.lastName[0]).toUpperCase();
      avatarCircle.style.background = '#c0c0c0';
      avatarCircle.innerHTML = `<span style="font-size:22px;font-weight:800;color:#fff;">${initials}</span>`;
    }
  }
}
});
