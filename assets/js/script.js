var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {

    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// ****************************
// Edit the Task Description
// Delegates parent a click to create a p element // delegated p click
// ****************************

$(".list-group").on("click", "p", function() {
  var text = $(this)
  .text()
  .trim();
  console.log(text);

  /* creates textarea */
  var textInput = $("<textarea>") // "textarea" finds elements, but "<textarea>" creates element
  .addClass("form-control")
  .val(text);
  console.log(textInput);

  $(this).replaceWith(textInput);
  textInput.trigger("focus");

});

// ************************************
// Update & Save the Task Description
// ************************************
$(".list-group").on("blur", "textarea", function() { // blur event will trigger as soon as user interacts with anything other than the <textarea> element
  
  // get the textarea's current value/text
  var text = $(this)
    .val()
    .trim();
  console.log(text); // do not need console.logs, but helpful to know exactly what you are targeting.
  
  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  console.log(status);

  // get the task's position in the list of other li elements (similar to an array 0, 1, 2, 3, etc.)
  var index = $(this) // position of this list-group-item is 1!
    .closest(".list-group-item")
    .index();
  console.log(index);

  // Update Overarching 'tasks' object with new data
  tasks[status][index].text = text; // check localStorage for the change in the tasks object
  saveTasks();

  // recreate p element (exists in memory only)
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);
  console.log(taskP);

  // replace textarea with p element (brings memory to realization)
  $(this).replaceWith(taskP);
  console.log(this);
});

// ************************************
// Edit Task Dates
// ************************************
// due date was clicked
$(".list-group").on("click", "span", function() {
  // get current text
  var date = $(this)
    .text()
    .trim();
  console.log(date);

  // create new input element (in memory only)
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);
  console.log(dateInput);

  // swap out elements (pulled from memory, made it tangible)
  $(this).replaceWith(dateInput);

  // automatically focus on new element
  dateInput.trigger("focus");
});

// ************************************
// Update & Save Task Dates
// ************************************
$(".list-group").on("blur", "input", function() {
  // get current text
  var date = $(this)
    .val()
    .trim();
  console.log(date);

  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  console.log(status);

  // get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index(); // this is a function method, has nothing to do with the variable called index
  console.log(index);

  // update task in array and re-save to localStorage (in memory?)
  tasks[status][index].date = date;
  saveTasks();
  console.log(date);

  // recreate span element with bootstrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge pill")
    .text(date);
  console.log(taskSpan);

  // replace input with span element
  $(this).replaceWith(taskSpan);

});

// creates sortable list; and connects it with others of their same class
$(".card .list-group").sortable({ // connect IDs or Classes INDIVIDUALLY
  connectWith: $(".card .list-group"), // connect IDs or Classes (OR GROUP) TOGETHER
  scroll: false,
  tolerance: "pointer",
  helper: "clone", // need to ask about this in more detail
  activate: function(event) { // need to ask about this in more detail
    console.log("activate", this);
  },
  deactivate: function(event) {
    console.log("deactivate", this);
  },
  over: function(event) {
    console.log("over", event.target);
  },
  out: function(event) {
    console.log("out", event.target);
  },
  update: function(event) {
    // array to store the task data in // IMPORTANT: Make sure you declare it first, otherwise it'll be headache to debug and test while you're working here
    var tempArr = [];
    
    // loop over current set of children in sortable list
    $(this).children().each(function() {
      var text = $(this)
        .find("p")
        .text()
        .trim();

      var date = $(this)
        .find("span")
        .text()
        .trim();
      console.log(text, date);

      // add task data to the temp array as an object
      tempArr.push({
        text: text,
        date: date
      });
    });

    // trim down list's ID to match object property
    var arrName = $(this)
      .attr("id")
      .replace("list-", "");
    
    // update array on tasks object and save
    tasks[arrName] = tempArr;
    saveTasks();
  }
});

$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function (event, ui) {
    ui.draggable.remove();
    console.log("drop");
  },
  over: function(event, ui) {
    console.log("over");
  },
  out: function(event, ui) {
    console.log("out");
  }
});









































// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


