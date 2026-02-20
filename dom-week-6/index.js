function deleteTodo(li, todoList) {
    li.classList.add('removing');
    setTimeout(() => {
        todoList.removeChild(li);
    }, 300);
}

function addTodo() {
    let todoInput = document.getElementById('todo-input');
    let todoText = todoInput.value.trim();
    
    if (todoText === '') {
        alert('Please enter a task!');
        return;
    }
    
    let todoList = document.getElementById('todo-list');
    
    let li = document.createElement('li');
    li.className = 'todo-item';
    
    let span = document.createElement('span');
    span.textContent = todoText;
    span.className = 'todo-text';
    
    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function() {
        deleteTodo(li, todoList);
    };
    
    span.onclick = function() {
        li.classList.toggle('completed');
    };
    
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
    
    todoInput.value = '';
    
    setTimeout(() => {
        li.classList.add('show');
    }, 10);
}