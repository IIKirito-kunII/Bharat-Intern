document.addEventListener("DOMContentLoaded", function () {
    // Get references to HTML elements
    const form = document.getElementById("createTaskForm");
    const assignedTasksList = document.getElementById("assignedTasksList");
    const completedTasksList = document.getElementById("completedTasksList");
    const myTasksList = document.getElementById("myTasksList");
    const allowedNames = ["Saurab", "Aryan", "Akash", "Ankush", "Satyam"];
    const writerNameInput = document.getElementById("writerName");
    const chatMessageInput = document.getElementById("chatMessage");
    const sendButton = document.getElementById("sendButton");
    const chatMessages = document.querySelector(".chat-messages");

    // Load chat messages from local storage if available
    const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    
    // Display stored chat messages
    storedMessages.forEach(message => {
        const chatMessageElement = document.createElement("div");
        chatMessageElement.className = "chat-message";
        chatMessageElement.textContent = message;
        chatMessages.appendChild(chatMessageElement);
    });

     // Handle send button click event for chat messages
    sendButton.addEventListener("click", function () {
        const writerName = writerNameInput.value;
        const chatMessage = chatMessageInput.value;

        if (writerName && chatMessage) {
            // Create and append chat message element
            const chatMessageElement = document.createElement("div");
            chatMessageElement.className = "chat-message";
            chatMessageElement.textContent = `${writerName}: ${chatMessage}`;
            chatMessages.appendChild(chatMessageElement);

            // Save to local storage
            const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
            storedMessages.push(`${writerName}: ${chatMessage}`);
            localStorage.setItem("chatMessages", JSON.stringify(storedMessages));

            // Clear message input
            chatMessageInput.value = "";
        } else {
            alert("Please select your name and type a message.");
        }
    });

    // Handle form submission for creating tasks
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get input values for task creation
        const taskName = form.querySelector("#taskName").value;
        const assignedBy = form.querySelector("#assignedTo").value;
        const dueDate = form.querySelector("#dueDate").value;

        // Create new task element and populate with input values
        const newTask = document.createElement("li");
        newTask.className = "task";
        newTask.innerHTML = `
            <div class="task-info">
                <h4>${taskName}</h4>
                <p class="task-due-date">Due on: ${dueDate}</p>
                <p class="task-assigne">Assigned by: ${assignedBy}</p>
            </div>
            <div class="task-actions">
                <button class="btn-start">Start Task</button>
                <button class="btn-complete">Task Completed</button>
            </div>
            <div class="comment-section">
                <textarea class="comment-input" placeholder="Add a comment"></textarea>
                <button class="comment-submit">Add Comment</button>
                <select class="commenter-names">
                    <option value="Saurab">Saurab</option>
                    <option value="Aryan">Aryan</option>
                    <option value="Akash">Akash</option>
                    <option value="Ankush">Ankush</option>
                    <option value="Satyam">Satyam</option>
                </select>
            </div>
            <div class="github-link">
                <label for="githubLink">GitHub Link:</label><br>
                <input type="text" name="githubLink" class="github-link-input"><br>
            </div>
            <div class="comment-list">
                <!-- Comment list will be appended here -->
            </div>
        `;

        // Append new task to assigned tasks list
        assignedTasksList.appendChild(newTask);

        // Clear form fields
        form.reset();

        // Add event listener for adding comments
        const commentSubmit = newTask.querySelector(".comment-submit");
        const commentInput = newTask.querySelector(".comment-input");
        const commenterNames = newTask.querySelector(".commenter-names");
        const commentList = newTask.querySelector(".comment-list");
        const githubLinkInput = newTask.querySelector(".github-link-input");

        commentSubmit.addEventListener("click", function () {
            const comment = commentInput.value;
            const selectedName = commenterNames.value;

            if (comment && selectedName) {
                // Create and append comment element
                const commentElement = document.createElement("p");
                commentElement.className = "comment";
                commentElement.textContent = `${selectedName}: ${comment}`;
                commentList.appendChild(commentElement);

                // Clear comment input
                commentInput.value = "";
            } else {
                alert("Please provide both a comment and select a commenter.");
            }
        });

        // Add event listener for starting and completing tasks
        const startTaskButton = newTask.querySelector(".btn-start");
        const completeTaskButton = newTask.querySelector(".btn-complete");
        startTaskButton.addEventListener("click", function () {
            const assignedTo = prompt("Enter your name (" + allowedNames.filter(name => name !== assignedBy).join(", ") + "):");
            if (assignedTo && allowedNames.includes(assignedTo)) {
                // Update task assignment and move to My Tasks
                newTask.querySelector(".task-assigne").textContent = `Assigned by: ${assignedBy} | Assigned to: ${assignedTo}`;
                newTask.querySelector(".btn-start").remove();
                myTasksList.appendChild(newTask);
            } else {
                alert("Invalid name. Please provide a valid name.");
            }
        });
    });

    // Add event listener for completing tasks
    completeTaskButton.addEventListener("click", function () {
        const githubLink = githubLinkInput.value;

        if (githubLink) {
            // Clone the task and modify for completion
            const completedTask = newTask.cloneNode(true);
            completedTask.querySelector(".github-link").innerHTML = `<p class="task-github-link">GitHub Link: <a href="${githubLink}" target="_blank">${githubLink}</a></p>`;
            completedTasksList.appendChild(completedTask);
            myTasksList.removeChild(newTask); // Remove from My Tasks
            assignedTasksList.removeChild(newTask);
            newTask.querySelector(".btn-start").remove();
            newTask.querySelector(".btn-complete").remove();
        } 
        else {
            alert("Please provide a GitHub link.");
        }
    });
});