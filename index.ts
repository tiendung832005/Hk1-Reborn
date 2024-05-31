interface ITodoList {
    id: number
    name: string
    completed: boolean
}
class TodoList implements ITodoList {
    id: number;
    name: string;
    completed: boolean
    constructor(id: number,
        name: string, completed: boolean) {
        this.id = id
        this.name = name
        this.completed = completed
    }
}

class TodoListMain {
    todolists: TodoList[];
    constructor() {
        const todoLocal = localStorage.getItem("todolists");
        this.todolists = todoLocal ? JSON.parse(todoLocal) : [];
    }
    // Lấy danh sách tất cả todo
    getAllTodoList(): TodoList[] {
        return this.todolists;
    }
    saveTodoList() {
        localStorage.setItem("todolists", JSON.stringify(this.todolists));
    }

    // Hiển thị
    renderJob(): TodoList[] {
        return this.todolists
    }

    // Thêm mới công việc
    createJob(newTodoList: TodoList): void {
        this.todolists.push(newTodoList);
        this.saveTodoList();
        loadNumber();
    }

    updateJob(todolistId: number): void {
        const Number1 = document.querySelector(`#Number1`) as HTMLElement;
        const Number2 = document.querySelector(`#Number2`) as HTMLElement;
        const checkbox = document.querySelector(`#add input[data-id="${todolistId}"]`) as HTMLInputElement;
        const jobName = document.querySelector(`#add input[data-id="${todolistId}"] + a`) as HTMLElement;
        if (checkbox && jobName) {
            if (checkbox.checked) {
                jobName.style.textDecoration = "line-through";
            } else {
                jobName.style.textDecoration = "none";
            }
        }
    }

    deleteJob(todolistId: number): void {
        this.todolists = this.todolists.filter((todolist: TodoList) => todolist.id !== todolistId);
        this.saveTodoList();
        loadNumber();
    }
}

const todolistMain = new TodoListMain();

// lấy ra các element trong DOM
const btnAddTodoListElement = document.querySelector("#button") as HTMLElement;
const inputE = document.querySelector("#input") as HTMLInputElement;
const listTodoElement = document.querySelector('#add') as HTMLElement;


// các hàm tương tác với DOM
const creatTodoList = () => {
    const newId = Math.ceil(Math.random() * 9999999);
    const todolist = new TodoList(newId, inputE.value, false);

    const element = document.querySelector('#notName')!;
    const element2 = document.querySelector('#nameDouble')!;
    if (inputE.value) {
        if (element instanceof HTMLElement) {
            element.style.display = "none";
        }
        if (element2 instanceof HTMLElement) {
            element2.style.display = "none";
        }
        let flag: number = 0;
        for (let i = 0; i < todolistMain.getAllTodoList().length; i++) {
            if (todolistMain.getAllTodoList()[i].name === inputE.value) {
                flag = 1;
            }
        }
        if (flag === 1) {
            if (element2 instanceof HTMLElement) {
                element2.style.display = "block";
            }
        } else {
            if (element instanceof HTMLElement) {
                element.style.display = "none";
            }
            todolistMain.createJob(todolist);
            inputE.value = "";
            renderTodoLists();
        }

    } else {
        if (element instanceof HTMLElement) {
            element.style.display = "block";
        }
    }

}

function renderTodoLists() {
    const todolistHTMLs = todolistMain.getAllTodoList().map((todolist: TodoList) => {
        return `
                    <div class="mid">
                        <div>
                            <input data-id="${todolist.id}" id="checkbox" type="checkbox">
                            <a class="completed">${todolist.name}</a>
                        </div>
                        <div>
                            <i class="fa-solid fa-pen"></i>
                            <i class="fa-solid fa-trash-can" data-id="${todolist.id}"></i> 
                        </div>
                    </div>
                `
    })
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
    const boxJobs = document.querySelectorAll<HTMLInputElement>('#checkbox');
    boxJobs.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            const todolistId = parseInt(checkbox.getAttribute('data-id') || "");
            const todolist = todolistMain.getAllTodoList().find(todo => todo.id === todolistId);
            if (todolist) {
                if (checkbox.checked) {
                    todolist.completed = true;
                    todolistMain.updateJob(todolistId);
                } else {
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
})

const Number2 = document.querySelector(`#Number2`) as HTMLElement;
function loadNumber(){
    Number2.innerHTML = `${todolistMain.todolists.length}`
}
loadNumber();

const bot2 = document.querySelector(`.bot2`) as HTMLElement;
const bot = document.querySelector(`.bot`) as HTMLElement;
function updateNumber1(): void {
    const Number1 = document.querySelector(`#Number1`) as HTMLElement;
    const checkboxes = document.querySelectorAll<HTMLInputElement>(`#add input[type="checkbox"]:checked`);
    if (Number1 && checkboxes) {
        Number1.innerHTML = checkboxes.length.toString();
        if (checkboxes.length === todolistMain.todolists.length) {
            bot2.style.display = "block"
            bot.style.display = "none"
        } else{
            bot.style.display = "block"
            bot2.style.display = "none"
        }
    }
}
