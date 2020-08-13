const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let informationDate = "";
const monthAndYear = document.getElementById("monthAndYear");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const showForm = date => {
  const addContent = document.getElementById("addContent");
  const informationDiv = document.getElementById("dateInformation");
  const information = JSON.parse(localStorage.getItem(date));
  const hoursInput = document.getElementById("serviceHours");
  const notesInput = document.getElementById("serviceNotes");

  hoursInput.value = information ? information.hoursServed : "";
  notesInput.value = information ? information.notes : "";

  let htmlString = `<h2>${date}</h2>`;

  addContent.style.display = "block";

  informationDiv.innerHTML = htmlString;
  informationDate = date;
};

const saveInformation = () => {
  const hoursInput = document.getElementById("serviceHours");
  const notesInput = document.getElementById("serviceNotes");
  const hoursServed = hoursInput.value;
  const notes = notesInput.value;

  if (hoursServed) {
    localStorage.setItem(
      informationDate,
      JSON.stringify({ hoursServed, notes })
    );

    hoursInput.value = "";
    notesInput.value = "";

    generateCalender(currentMonth, currentYear);
    toast("success", "Saved Successfully");
  } else {
    toast("error", "Please include the number of hours served");
  }
};

const daysInMonth = (iMonth, iYear) => {
  return 32 - new Date(iYear, iMonth, 32).getDate();
};

const generateCalender = (month, year) => {
  let firstDay = new Date(year, month).getDay();

  tbl = document.getElementById("calendarBody"); // body of the calendar

  // clearing all previous cells
  tbl.innerHTML = "";

  // filing data about month and in the page via DOM.
  monthAndYear.innerHTML = months[month] + " " + year;

  // creating all cells
  let date = 1;
  for (let i = 0; i < 6; i++) {
    // creates a table row
    let row = document.createElement("tr");

    //creating individual cells, filing them up with data.
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cell = document.createElement("td");

        row.appendChild(cell);
      } else if (date > daysInMonth(month, year)) {
        break;
      } else {
        cell = document.createElement("td");
        cell.className = "dateCell";

        const cellData = JSON.parse(
          localStorage.getItem(`${currentMonth + 1}-${date}-${currentYear}`)
        );
        if (cellData) {
          const truncationLength = 20;
          const truncatedNotes =
            cellData.notes.length > truncationLength
              ? cellData.notes.substring(0, truncationLength) + "..."
              : cellData.notes;

          cell.innerHTML = `
            <div class="displayDate">
              <strong>${date}</strong>
            </div>

            <div class="cellInformation">
              <p>${cellData.hoursServed} hours served</p>
              <p>${truncatedNotes}</p>
            </div>
        `;
        } else {
          cell.innerHTML = `
          <div class="displayDate">
            <strong >${date}</strong>
          </div>`;
        }

        if (
          date === today.getDate() &&
          year === today.getFullYear() &&
          month === today.getMonth()
        ) {
          // color today's date
          cell.setAttribute("id", "currentDay");
        }
        const dateString = `${month + 1}-${date}-${year}`;
        cell.addEventListener("click", () => showForm(dateString), {
          passive: true
        });
        row.appendChild(cell);
        date++;
      }
    }

    tbl.appendChild(row); // appending each row into calendar body.
  }
};

const nextMonth = () => {
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  generateCalender(currentMonth, currentYear);
};

const previousMonth = () => {
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  generateCalender(currentMonth, currentYear);
};

const getToday = () => {
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  generateCalender(currentMonth, currentYear);
};

document.addEventListener("DOMContentLoaded", () =>
  generateCalender(currentMonth, currentYear)
);

const toast = (type, message) => {
  const toast = document.getElementById("toast");
  toast.innerHTML = message;
  toast.className = `show ${type}`;

  setTimeout(function() {
    toast.className = toast.className.replace("show", "");
  }, 3000);
};

document.onkeydown = event => {
  let code;
  let e;
  if (document.all) {
    if (!event) {
      let e = window.event;
      code = e.keyCode;
    }
  } else if (event.which) {
    code = event.which;
    e = event;
  }
  if (code == 9) {
    document.body.className = "";
  }
};
