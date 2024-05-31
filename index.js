"use strict";
class TodoList {
    constructor(id, name, completed) {
        this.id = id;
        this.name = name;
        this.completed = completed;
    }
}
class TodoListMain {
    constructor() {
        const todoLocal = localStorage.getItem("todolists");
        this.todolists = todoLocal ? JSON.parse(todoLocal) : [];
    }
    // Lấy danh sách
    getAllTodoList() {
        return this.todolists;
    }
    // Lưu lại
    saveTodoList() {
        localStorage.setItem("todolists", JSON.stringify(this.todolists));
    }
    // Hiển thị ra
    renderJob() {
        return this.todolists;
    }
    // Thêm mới công việc
    createJob(newTodoList) {
        this.todolists.push(newTodoList);
        this.saveTodoList();
        loadNumber();
    }
    // Cập nhật công việc
    updateJob(todolistId) {
        const Number1 = document.querySelector(`#Number1`);
        const Number2 = document.querySelector(`#Number2`);
        const checkbox = document.querySelector(`#add input[data-id="${todolistId}"]`);
        const jobName = document.querySelector(`#add input[data-id="${todolistId}"] + a`);
        if (checkbox && jobName) {
            if (checkbox.checked) {
                jobName.style.textDecoration = "line-through";
            }
            else {
                jobName.style.textDecoration = "none";
            }
        }
    }
    deleteJob(todolistId) {
        this.todolists = this.todolists.filter((todolist) => todolist.id !== todolistId);
        this.saveTodoList();
        loadNumber();
    }
}
const todolistMain = new TodoListMain();
// lấy ra các element trong DOM
const btnAddTodoListElement = document.querySelector("#button");
const input = document.querySelector("#input");
const listTodoElement = document.querySelector('#add');
// các hàm tương tác với DOM
const creatTodoList = () => {
    const newId = Math.ceil(Math.random() * 999999);
    const todolist = new TodoList(newId, input.value, false);
    const element = document.querySelector('#notName');
    const element1 = document.querySelector('#nameDouble');
    if (input.value) {
        if (element instanceof HTMLElement) {
            element.style.display = "none";
        }
        if (element1 instanceof HTMLElement) {
            element1.style.display = "none";
        }
        let flag = 0;
        for (let i = 0; i < todolistMain.getAllTodoList().length; i++) {
            if (todolistMain.getAllTodoList()[i].name === input.value) {
                flag = 1;
            }
        }
        if (flag === 1) {
            if (element1 instanceof HTMLElement) {
                element1.style.display = "block";
            }
        }
        else {
            if (element instanceof HTMLElement) {
                element.style.display = "none";
            }
            todolistMain.createJob(todolist);
            input.value = "";
            renderTodoLists();
        }
    }
    else {
        if (element instanceof HTMLElement) {
            element.style.display = "block";
        }
    }
};
function renderTodoLists() {
    const todolistHTMLs = todolistMain.getAllTodoList().map((todolist) => {
        return `
                    <div class="mid-body">
                        <div>
                            <input data-id="${todolist.id}" id="checkbox" type="checkbox">
                            <a class="completed">${todolist.name}</a>
                        </div>
                        <div>
                            <i class="fa-solid fa-pen"></i>
                            <i class="fa-solid fa-trash-can" data-id="${todolist.id}"></i> 
                        </div>
                    </div>
                `;
    });
    const convertToString = todolistHTMLs.join("");
    listTodoElement.innerHTML = convertToString;
    // Lắng nghe sự kiện click trên mỗi biểu tượng xóa sau khi render xong
    const deleteJobs = document.querySelectorAll('.fa-trash-can');
    deleteJobs.forEach(button => {
        button.addEventListener('click', () => {
            const isConfirmed = confirm("Bạn có chắc chắn muốn xóa công việc này?");
            if (isConfirmed) {
                const todolistId = parseInt(button.getAttribute('data-id') || "");
                console.log(todolistId);
                todolistMain.deleteJob(todolistId);
                renderTodoLists(); // Sau khi xóa, cập nhật lại giao diện
            }
        });
    });
    // Lắng nghe sự kiện click ô vuông
    const boxJobs = document.querySelectorAll('#checkbox');
    boxJobs.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            const todolistId = parseInt(checkbox.getAttribute('data-id') || "");
            const todolist = todolistMain.getAllTodoList().find(todo => todo.id === todolistId);
            if (todolist) {
                if (checkbox.checked) {
                    todolist.completed = true;
                    todolistMain.updateJob(todolistId);
                }
                else {
                    todolist.completed = false;
                    todolistMain.updateJob(todolistId);
                }
                updateNumber1();
            }
        });
    });
}
// Gọi hàm renderTodoLists để hiển thị danh sách todo khi trang được load
renderTodoLists();
// bắt sự kiện trên DOM
// bấm vào nút button thêm mới
btnAddTodoListElement.addEventListener("click", () => {
    creatTodoList();
});
const Number2 = document.querySelector(`#Number2`);
function loadNumber() {
    Number2.innerHTML = `${todolistMain.todolists.length}`;
}
loadNumber();
const bot2 = document.querySelector(`.bot2`);
const bot = document.querySelector(`.bot`);
function updateNumber1() {
    const Number1 = document.querySelector(`#Number1`);
    const checkboxes = document.querySelectorAll(`#add input[type="checkbox"]:checked`);
    if (Number1 && checkboxes) {
        Number1.innerHTML = checkboxes.length.toString();
        if (checkboxes.length === todolistMain.todolists.length) {
            bot2.style.display = "block";
            bot.style.display = "none";
        }
        else {
            bot.style.display = "block";
            bot2.style.display = "none";
        }
    }
}
