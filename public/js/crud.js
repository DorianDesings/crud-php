'use strict';

var main = document.getElementById('main');
var allUsers = document.getElementById('all-users');
var userInfo = document.getElementById('user-info');

var allNames = [];
var allUsersData = [];

var contentUsers = document.getElementById('content-users');

var allUserCheck = document.getElementById('select-all-users');
var deleteAllButton = document.getElementById('delete-all-users');

var allUsersButtons = Array.from(document.querySelectorAll('.content__users .button'));

var allUserChecks = Array.from(document.querySelectorAll('.content__users .content__checkbox'));

var topBarTitle = document.getElementById('top-bar-title');

var addUserButton = document.getElementById('add-user');
var updateUserButton = document.getElementById('update-user');

var searchText = document.getElementById('search-text');

var newUser = true;

var userName = document.getElementById('user-info-name');
var userSurname = document.getElementById('user-info-surname');
var userEmail = document.getElementById('user-info-email');

var showUserInfo = function showUserInfo() {
    allUsers.classList.add('all-users--hide');
    userInfo.classList.add('user-info--show');
};

var hideUserInfo = function hideUserInfo() {
    allUsers.classList.remove('all-users--hide');
    userInfo.classList.remove('user-info--show');
};

var selectUser = function selectUser(id) {
    var element = document.getElementById(id);

    allUsersButtons = Array.from(document.querySelectorAll('.content__users .button'));
    allUserChecks = Array.from(document.querySelectorAll('.content__users .content__checkbox'));

    if (element.checked) {
        allUserChecks.map(function (check) {
            return check.checked = false;
        });
        element.checked = true;
        allUsersButtons.map(function (button) {
            return button.classList.add('button--hide');
        });
        Array.from(element.parentElement.querySelectorAll('.button')).map(function (button) {
            return button.classList.remove('button--hide');
        });
    } else {
        allUsersButtons.map(function (button) {
            return button.classList.remove('button--hide');
        });
    }
};

var selectAllUsers = function selectAllUsers() {
    allUsersButtons = Array.from(document.querySelectorAll('.content__users .button'));
    allUserChecks = Array.from(document.querySelectorAll('.content__users .content__checkbox'));

    if (allUserCheck.checked) {
        allUserChecks.map(function (check) {
            return check.checked = true;
        });
        allUsersButtons.map(function (button) {
            return button.classList.add('button--hide');
        });
        deleteAllButton.classList.remove('button--hide');
    } else {
        allUserChecks.map(function (check) {
            return check.checked = false;
        });
        allUsersButtons.map(function (button) {
            return button.classList.remove('button--hide');
        });
        deleteAllButton.classList.add('button--hide');
    }
};

var addUser = function addUser() {
    topBarTitle.textContent = 'New User';

    addUserButton.classList.remove('button--hide');
    updateUserButton.classList.add('button--hide');
};

var saveUser = function saveUser(id) {
    topBarTitle.textContent = 'Edit User';

    addUserButton.classList.add('button--hide');
    updateUserButton.classList.remove('button--hide');

    var user = getUserId(id);

    userName.value = user.name;
    userSurname.value = user.surname;
    userEmail.value = user.email;

    updateUserButton.dataset.id = user.id;
};

var getUserId = function getUserId(id) {
    id = id.substring(id.lastIndexOf('-') + 1);

    return allUsersData.filter(function (user) {
        return user.id == id;
    })[0];
};

var getAllUsers = function getAllUsers() {
    var path = 'php/read-all.php';

    fetch(path).then(function (response) {
        return response.ok ? Promise.resolve(response) : Promise.reject(new Error('Failed to load'));
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        allUsersData = data;
        var fragment = document.createDocumentFragment();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var user = _step.value;

                fragment.appendChild(createUserRow(user));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        contentUsers.innerHTML = '';
        contentUsers.appendChild(fragment);

        allNames = Array.from(document.querySelectorAll('[data-name]'));
        console.log(allNames);
    }).catch(function (error) {
        return console.log('Error: ' + error.message);
    });
};

var createUserRow = function createUserRow(user) {

    var fragment = document.createDocumentFragment();

    var userRow = document.createElement('DIV');
    userRow.classList.add('content__user');

    var userCheck = document.createElement('INPUT');
    userCheck.setAttribute('type', 'checkbox');

    userRow.appendChild(userCheck);

    var userName = document.createElement('P');
    userName.dataset.name = user.name;
    userName.classList.add('content__text');
    userName.textContent = user.name;

    userRow.appendChild(userName);

    var userSurname = document.createElement('P');
    userSurname.classList.add('content__text');
    userSurname.textContent = user.surname;

    userRow.appendChild(userSurname);

    var userEmail = document.createElement('P');
    userEmail.classList.add('content__text', 'content__text--email');
    userEmail.textContent = user.email;

    userRow.appendChild(userEmail);

    var buttonEdit = document.createElement('A');
    buttonEdit.classList.add('content__link', 'button', 'button--edit');
    buttonEdit.textContent = 'Edit';
    buttonEdit.id = 'edit-user-' + user.id;

    var buttonIcon = document.createElement('I');
    buttonIcon.classList.add('fas', 'fa-pen');

    buttonEdit.appendChild(buttonIcon);

    userRow.appendChild(buttonEdit);

    var buttonDelete = document.createElement('A');
    buttonDelete.classList.add('content__link', 'button', 'button--delete');
    buttonDelete.textContent = 'Delete';
    buttonDelete.id = 'delete-user-' + user.id;

    buttonIcon = document.createElement('I');
    buttonIcon.classList.add('fas', 'fa-trash');

    buttonDelete.appendChild(buttonIcon);

    userRow.appendChild(buttonDelete);

    fragment.appendChild(userRow);

    return fragment;
};

var insertUser = function insertUser() {

    var path = 'php/insert.php';

    var formData = new FormData();
    formData.append('name', userName.value.toLowerCase());
    formData.append('surname', userSurname.value.toLowerCase());
    formData.append('email', userEmail.value.toLowerCase());

    fetch(path, {
        method: 'POST',
        body: formData
    }).then(function (response) {
        return response.ok ? Promise.resolve(response) : Promise.reject(new Error('Failed to load'));
    }).then(function (response) {
        return response.text();
    }).then(function (data) {
        if (data === 'ok') {
            resetForm();
            getAllUsers();
            hideUserInfo();
        }
    }).catch(function (error) {
        return console.log('Error: ' + error.message);
    });
};

var updateUser = function updateUser() {

    var path = 'php/update.php';

    var formData = new FormData();
    formData.append('id', updateUserButton.dataset.id);
    formData.append('name', userName.value.toLowerCase());
    formData.append('surname', userSurname.value.toLowerCase());
    formData.append('email', userEmail.value.toLowerCase());

    fetch(path, {
        method: 'POST',
        body: formData
    }).then(function (response) {
        return response.ok ? Promise.resolve(response) : Promise.reject(new Error('Failed to load'));
    }).then(function (response) {
        return response.text();
    }).then(function (data) {
        if (data === 'ok') {
            resetForm();
            getAllUsers();
            hideUserInfo();
        }
    }).catch(function (error) {
        return console.log('Error: ' + error.message);
    });
};

var deleteUser = function deleteUser(id) {
    var path = "php/delete.php";

    id = getUserId(id).id;

    var formData = new FormData();
    formData.append("id", id);

    fetch(path, {
        method: "POST",
        body: formData
    }).then(function (response) {
        return response.ok ? Promise.resolve(response) : Promise.reject(new Error("Failed to load"));
    }).then(function (response) {
        return response.text();
    }).then(function (data) {
        if (data === "ok") {
            location.href = 'http://localhost:3000/crud/public/';
        }
    }).catch(function (error) {
        return console.log('Error: ' + error.message);
    });
};

var resetForm = function resetForm() {
    userName.value = '';
    userSurname.value = '';
    userEmail.value = '';
};

main.addEventListener('click', function (e) {
    if (e.target.classList.contains('top-bar__user-info') || e.target.classList.contains('fa-plus')) {
        newUser = true;
        addUser();
        showUserInfo();
    } else if (e.target.classList.contains('button--cancel')) {
        hideUserInfo();
    } else if (e.target.classList.contains('content__checkbox')) {
        selectUser(e.target.id);
    } else if (e.target.id === 'select-all-users') {
        selectAllUsers();
    } else if (e.target.id.indexOf('edit-user') !== -1) {
        newUser = false;
        saveUser(e.target.id);
        showUserInfo();
    } else if (e.target.id == 'add-user') {
        insertUser();
    } else if (e.target.id == 'update-user') {
        updateUser();
    } else if (e.target.id.indexOf('delete-user') != -1) {
        deleteUser(e.target.id);
    }
});

searchText.addEventListener('keyup', function (e) {
    var value = searchText.value.toLowerCase();

    if (value == '') {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = allNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var name = _step2.value;

                name.parentElement.style.display = 'grid';
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = allNames[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _name = _step3.value;

            if (_name.dataset.name.indexOf(value) == -1) {
                _name.parentElement.style.display = 'none';
            } else {
                _name.parentElement.style.display = 'grid';
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }
});

getAllUsers();