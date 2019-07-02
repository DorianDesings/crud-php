const main = document.getElementById('main')
const allUsers = document.getElementById('all-users')
const userInfo = document.getElementById('user-info')

let allNames = []
let allUsersData = []

const contentUsers = document.getElementById('content-users')

const allUserCheck = document.getElementById('select-all-users')
const deleteAllButton = document.getElementById('delete-all-users')

let allUsersButtons = Array.from(document.querySelectorAll('.content__users .button'))

let allUserChecks = Array.from(document.querySelectorAll('.content__users .content__checkbox'))

const topBarTitle = document.getElementById('top-bar-title')

const addUserButton = document.getElementById('add-user')
const updateUserButton = document.getElementById('update-user')

const searchText = document.getElementById('search-text')

let newUser = true

const userName = document.getElementById('user-info-name')
const userSurname = document.getElementById('user-info-surname')
const userEmail = document.getElementById('user-info-email')

const showUserInfo = () => {
    allUsers.classList.add('all-users--hide')
    userInfo.classList.add('user-info--show')
}

const hideUserInfo = () => {
    allUsers.classList.remove('all-users--hide')
    userInfo.classList.remove('user-info--show')
}

const selectUser = (id) => {
    const element = document.getElementById(id);

    allUsersButtons = Array.from(document.querySelectorAll('.content__users .button'))
    allUserChecks = Array.from(document.querySelectorAll('.content__users .content__checkbox'))

    if (element.checked) {
        allUserChecks.map(check => check.checked = false)
        element.checked = true
        allUsersButtons.map(button => button.classList.add('button--hide'))
        Array.from(element.parentElement.querySelectorAll('.button')).map(button => button.classList.remove('button--hide'))
    } else {
        allUsersButtons.map(button => button.classList.remove('button--hide'))
    }
}

const selectAllUsers = () => {
    allUsersButtons = Array.from(document.querySelectorAll('.content__users .button'))
    allUserChecks = Array.from(document.querySelectorAll('.content__users .content__checkbox'))

    if (allUserCheck.checked) {
        allUserChecks.map(check => check.checked = true)
        allUsersButtons.map(button => button.classList.add('button--hide'))
        deleteAllButton.classList.remove('button--hide')
    } else {
        allUserChecks.map(check => check.checked = false)
        allUsersButtons.map(button => button.classList.remove('button--hide'))
        deleteAllButton.classList.add('button--hide')
    }
}

const addUser = () => {
    topBarTitle.textContent = 'New User'

    addUserButton.classList.remove('button--hide')
    updateUserButton.classList.add('button--hide')

}

const saveUser = (id) => {
    topBarTitle.textContent = 'Edit User'

    addUserButton.classList.add('button--hide')
    updateUserButton.classList.remove('button--hide')

    const user = getUserId(id)

    userName.value = user.name
    userSurname.value = user.surname
    userEmail.value = user.email

    updateUserButton.dataset.id = user.id
}

const getUserId = (id) => {
    id = id.substring(id.lastIndexOf('-') + 1)

    return allUsersData.filter(user => user.id == id)[0]
}

const getAllUsers = () => {
    const path = ('php/read-all.php')

    fetch(path)

        .then(response => (response.ok) ? Promise.resolve(response) : Promise.reject(new Error('Failed to load')))

        .then(response => console.log(response.json()))

        .then(data => {
            allUsersData = data
            const fragment = document.createDocumentFragment()

            for (const user of data) {
                fragment.appendChild(createUserRow(user))
            }

            contentUsers.innerHTML = ''
            contentUsers.appendChild(fragment)

            allNames = Array.from(document.querySelectorAll('[data-name]'))
            console.log(allNames);
        })

        .catch((error) => console.log(`Error: ${error.message}`))
}

const createUserRow = (user) => {

    const fragment = document.createDocumentFragment()

    let userRow = document.createElement('DIV')
    userRow.classList.add('content__user')

    let userCheck = document.createElement('INPUT')
    userCheck.setAttribute('type', 'checkbox')

    userRow.appendChild(userCheck)

    let userName = document.createElement('P')
    userName.dataset.name = user.name
    userName.classList.add('content__text')
    userName.textContent = user.name

    userRow.appendChild(userName)

    let userSurname = document.createElement('P')
    userSurname.classList.add('content__text')
    userSurname.textContent = user.surname

    userRow.appendChild(userSurname)

    let userEmail = document.createElement('P')
    userEmail.classList.add('content__text', 'content__text--email')
    userEmail.textContent = user.email

    userRow.appendChild(userEmail)

    let buttonEdit = document.createElement('A')
    buttonEdit.classList.add('content__link', 'button', 'button--edit')
    buttonEdit.textContent = 'Edit'
    buttonEdit.id = `edit-user-${user.id}`

    let buttonIcon = document.createElement('I')
    buttonIcon.classList.add('fas', 'fa-pen')

    buttonEdit.appendChild(buttonIcon)

    userRow.appendChild(buttonEdit)

    let buttonDelete = document.createElement('A')
    buttonDelete.classList.add('content__link', 'button', 'button--delete')
    buttonDelete.textContent = 'Delete'
    buttonDelete.id = `delete-user-${user.id}`

    buttonIcon = document.createElement('I')
    buttonIcon.classList.add('fas', 'fa-trash')

    buttonDelete.appendChild(buttonIcon)

    userRow.appendChild(buttonDelete)

    fragment.appendChild(userRow)

    return fragment
}

const insertUser = () => {

    const path = ('php/insert.php')

    const formData = new FormData()
    formData.append('name', userName.value.toLowerCase())
    formData.append('surname', userSurname.value.toLowerCase())
    formData.append('email', userEmail.value.toLowerCase())

    fetch(path, {
        method: 'POST',
        body: formData
    })

        .then(response => (response.ok) ? Promise.resolve(response) : Promise.reject(new Error('Failed to load')))

        .then(response => response.text())

        .then(data => {
            if (data === 'ok') {
                resetForm()
                getAllUsers()
                hideUserInfo()
            }
        })

        .catch((error) => console.log(`Error: ${error.message}`))

}

const updateUser = () => {

    const path = ('php/update.php')

    const formData = new FormData()
    formData.append('id', updateUserButton.dataset.id)
    formData.append('name', userName.value.toLowerCase())
    formData.append('surname', userSurname.value.toLowerCase())
    formData.append('email', userEmail.value.toLowerCase())

    fetch(path, {
        method: 'POST',
        body: formData
    })

        .then(response => (response.ok) ? Promise.resolve(response) : Promise.reject(new Error('Failed to load')))

        .then(response => response.text())

        .then(data => {
            if (data === 'ok') {
                resetForm()
                getAllUsers()
                hideUserInfo()
            }
        })

        .catch((error) => console.log(`Error: ${error.message}`))

}

const deleteUser = (id) => {
    const path = "php/delete.php";

    id = getUserId(id).id

    const formData = new FormData();
    formData.append("id", id);

    fetch(path, {
        method: "POST",
        body: formData
    })
        .then(
            response =>
                response.ok
                    ? Promise.resolve(response)
                    : Promise.reject(new Error("Failed to load"))
        )

        .then(response => response.text())

        .then(data => {
            if (data === "ok") {
                location.href = 'http://localhost:3000/crud/public/'
            }
        })

        .catch(error => console.log(`Error: ${error.message}`));
};

const resetForm = () => {
    userName.value = ''
    userSurname.value = ''
    userEmail.value = ''
}

main.addEventListener('click', (e) => {
    if (e.target.classList.contains('top-bar__user-info') || e.target.classList.contains('fa-plus')) {
        newUser = true
        addUser()
        showUserInfo();
    } else if (e.target.classList.contains('button--cancel')) {
        hideUserInfo()
    } else if (e.target.classList.contains('content__checkbox')) {
        selectUser(e.target.id)
    } else if (e.target.id === 'select-all-users') {
        selectAllUsers()
    } else if (e.target.id.indexOf('edit-user') !== -1) {
        newUser = false
        saveUser(e.target.id)
        showUserInfo()
    } else if (e.target.id == 'add-user') {
        insertUser()
    } else if (e.target.id == 'update-user') {
        updateUser()
    } else if (e.target.id.indexOf('delete-user') != -1) {
        deleteUser(e.target.id)
    }
})

searchText.addEventListener('keyup', (e) => {
    let value = searchText.value.toLowerCase()

    if (value == '') {
        for (const name of allNames) {
            name.parentElement.style.display = 'grid'
        }
    }

    for (const name of allNames) {
        if (name.dataset.name.indexOf(value) == -1) {
            name.parentElement.style.display = 'none'
        } else {
            name.parentElement.style.display = 'grid'
        }
    }
})

getAllUsers()