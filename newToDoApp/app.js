let taskInput = document.querySelector('.task-input input')
filters = document.querySelectorAll('.filters span')
clearAll = document.querySelector('.clear-btn')
let taskBox = document.querySelector('.task-box')
// localStorage.clear()
let editId;
let isEditedTask = false;
let todos = JSON.parse(localStorage.getItem('todo'))

filters.forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelector('span.active').classList.remove('active')
        btn.classList.add('active')
        showToDo(btn.id)
    })
})

function showToDo(filter) {
    let li = "";
    if (todos) {
        todos.forEach((item, id) => {
            let isCompleted = item.status == 'completed' ? 'checked' : '';
            if (filter == item.status || filter == "all") {
                li += `
                <li class="task">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                    <p class="${isCompleted}">${item.name}</p>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, '${item.name}')">
                            <i class="fa-solid fa-pen"></i>
                            Edit
                        </li>
                        <li onclick="deleteTask(${id})">
                            <i class="fa-regular fa-trash-can"></i>
                            Delete
                        </li>
                    </ul>
                </div>
            </li>`;
            }
        })
    }
    taskBox.innerHTML = li || `<span>You don't have any task here...</span>`
}
showToDo('all')

function showMenu(selectedTask) {
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add('show')
    document.addEventListener('click', (e) => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove('show')
        }
    })
}

function editTask(taskId, taskName) {
    editId = taskId
    isEditedTask = true
    taskInput.value = taskName;
}

function deleteTask(deleteId) {
    todos.splice(deleteId, 1);
    localStorage.setItem('todo', JSON.stringify(todos));
    showToDo('all')
}

clearAll.addEventListener('click', () =>{
    todos.splice(0, todos.length);
    localStorage.setItem('todo', JSON.stringify(todos));
    showToDo('all')
})

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add('checked')
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove('checked')
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem('todo', JSON.stringify(todos))
}

taskInput.addEventListener('keyup', (e) => {
    e.preventDefault()
    let userTask = taskInput.value.trim()

    if (e.key == "Enter" && userTask) {
        // console.log(todos)
        if (!isEditedTask) {
            if (!todos) {
                todos = []
            }
            let taskInfo = {
                name: userTask,
                status: "pending"
            }
            todos.push(taskInfo)
        } else {
            isEditedTask = false
            todos[editId].name = userTask
        }
        taskInput.value = "";
        localStorage.setItem('todo', JSON.stringify(todos))
        showToDo('all')
    }
})