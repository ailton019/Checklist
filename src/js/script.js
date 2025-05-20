// Pega elementos do DOM
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Carrega tarefas do localStorage
window.onload = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => renderTask(task.text, task.completed));

  const savedNumber = localStorage.getItem("whatsappNumber");
  if (savedNumber) {
    document.getElementById("whatsapp-number").value = savedNumber;
  }
};

// Adiciona nova tarefa
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  renderTask(taskText, false);
  saveTasks();
  taskInput.value = "";
}

// Renderiza tarefa na tela
function renderTask(text, completed) {
  const li = document.createElement("li");
  li.className = completed ? "completed" : "";
  li.innerHTML = `
    <span onclick="toggleTask(this)">${text}</span>
    <button class="remove" onclick="removeTask(this)">X</button>
  `;
  taskList.appendChild(li);
  saveTasks();
}

// Marca ou desmarca tarefa como concluída
function toggleTask(element) {
  element.parentElement.classList.toggle("completed");
  saveTasks();
}

// Remove tarefa
function removeTask(button) {
  button.parentElement.remove();
  saveTasks();
}

// Salva no localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function sendTasksToWhatsApp() {
  const numberInput = document.getElementById("whatsapp-number");
  const number = numberInput.value.trim();

  if (!number) {
    alert("Por favor, insira seu número do WhatsApp.");
    return;
  }

  localStorage.setItem("whatsappNumber", number);

  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    const text = li.querySelector("span").textContent;
    const status = li.classList.contains("completed") ? "✅" : "🕒";
    tasks.push(`${status} ${text}`);
  });

  if (tasks.length === 0) {
    alert("Sua lista está vazia!");
    return;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR");
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const message = encodeURIComponent(`📋 *Checklist Diário - ${dateStr} às ${timeStr}:*\n\n${tasks.join("\n")}`);
  const url = `https://wa.me/55${number}?text=${message}`;

  window.open(url, "_blank");
}
