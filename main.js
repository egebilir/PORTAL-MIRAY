document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu functionality
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", function () {
      this.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking a link
    const menuLinks = navMenu.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenuToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // News & Announcements functionality
  const closeNewsBtn = document.getElementById("close-news");
  const newsContainer = document.querySelector(".news-container");
  const viewAllNewsBtn = document.getElementById("view-all-news");
  const addNewsBtn = document.getElementById("add-news");
  const newsModal = document.getElementById("news-modal");
  const cancelNewsBtn = document.getElementById("cancel-news-btn");
  const newsForm = document.getElementById("news-form");
  const newsContent = document.getElementById("news-content");

  // Initialize news items from localStorage or use defaults
  let newsItems = JSON.parse(localStorage.getItem("newsItems")) || [
    {
      id: "news-1",
      date: "April 26, 2025",
      title: "Welcome Aboard!",
      content:
        "Welcome to the Miray Cruises digital portal. We're excited to have you onboard!",
    },
    {
      id: "news-2",
      date: "April 26, 2025",
      title: "Evening Entertainment",
      content:
        'Tonight\'s show "Mediterranean Nights" starts at 8:00 PM in the Grand Ballroom.',
    },
    {
      id: "news-3",
      date: "April 25, 2025",
      title: "Shore Excursion Update",
      content:
        'Tomorrow\'s "Island Discovery" tour will depart at 9:30 AM instead of 10:00 AM. Please be at the meeting point by 9:15 AM.',
    },
  ];

  // Save initial news items to localStorage if not already there
  if (!localStorage.getItem("newsItems")) {
    localStorage.setItem("newsItems", JSON.stringify(newsItems));
  }

  if (closeNewsBtn && newsContainer) {
    // Check if user has previously closed the news
    const isNewsClosed = localStorage.getItem("newsClosed");

    if (isNewsClosed === "true") {
      newsContainer.style.display = "none";
    }

    closeNewsBtn.addEventListener("click", function () {
      newsContainer.style.display = "none";
      localStorage.setItem("newsClosed", "true");
    });
  }

  if (viewAllNewsBtn) {
    viewAllNewsBtn.addEventListener("click", function () {
      // In a real implementation, this would link to a full news page
      alert("This would navigate to a full news & announcements page.");
    });
  }

  // Admin functionality for news management
  if (addNewsBtn && newsModal && cancelNewsBtn && newsForm) {
    // Open the modal when Add button is clicked
    addNewsBtn.addEventListener("click", function () {
      // Verify admin status before showing modal
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "admin") {
        alert("You need to be logged in as an admin to add announcements.");
        return;
      }

      // Clear form fields
      newsForm.reset();

      // Show the modal
      newsModal.style.display = "flex";
    });

    // Close modal when Cancel is clicked
    cancelNewsBtn.addEventListener("click", function () {
      newsModal.style.display = "none";
    });

    // Handle form submission
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Verify admin status again
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "admin") {
        alert("You need to be logged in as an admin to add announcements.");
        return;
      }

      // Get form values
      const title = document.getElementById("news-title").value;
      const content = document.getElementById("news-content").value;

      // Create a new news item
      const newItem = {
        id: "news-" + Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        title: title,
        content: content,
      };

      // Add to news items array
      newsItems.unshift(newItem); // Add to the beginning

      // Update localStorage
      localStorage.setItem("newsItems", JSON.stringify(newsItems));

      // Refresh news display
      renderNewsItems();

      // Close the modal
      newsModal.style.display = "none";
    });
  }

  // Setup delete buttons for news items
  function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".delete-news-btn");

    deleteButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation();

        // Verify admin status
        const userRole = localStorage.getItem("userRole");
        if (userRole !== "admin") {
          alert(
            "You need to be logged in as an admin to delete announcements."
          );
          return;
        }

        // Confirm deletion
        if (!confirm("Are you sure you want to delete this announcement?")) {
          return;
        }

        // Get the news item ID
        const newsItem = this.closest(".news-item");
        const newsId = newsItem.getAttribute("data-id");

        // Remove from array
        newsItems = newsItems.filter((item) => item.id !== newsId);

        // Update localStorage
        localStorage.setItem("newsItems", JSON.stringify(newsItems));

        // Refresh news display
        renderNewsItems();
      });
    });
  }

  // Render news items from the array
  function renderNewsItems() {
    if (!newsContent) return;

    // Clear current content
    newsContent.innerHTML = "";

    // Add items from the array
    if (newsItems.length > 0) {
      newsItems.forEach((item) => {
        const newsItem = document.createElement("div");
        newsItem.className = "news-item";
        newsItem.setAttribute("data-id", item.id);

        newsItem.innerHTML = `
          <span class="news-date">${item.date}</span>
          <h4>${item.title}</h4>
          <p>${item.content}</p>
          <button class="delete-news-btn admin-only" title="Delete announcement">✕</button>
        `;

        newsContent.appendChild(newsItem);
      });
    } else {
      // No news items
      const noNews = document.createElement("div");
      noNews.className = "news-item empty-state";
      noNews.textContent = "No announcements available.";
      newsContent.appendChild(noNews);
    }

    // Setup delete buttons
    setupDeleteButtons();

    // Update UI for current role
    const currentRole = localStorage.getItem("userRole") || "user";
    updateUIForRole(currentRole);
  }

  // Initial render of news items
  renderNewsItems();

  // User role management
  initUserRoleManagement();

  // Set current date if the element exists
  const currentDateEl = document.getElementById("current-date");
  if (currentDateEl) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    currentDateEl.textContent = new Date().toLocaleDateString("en-US", options);
  }

  // File upload functionality
  initFileUpload();

  // Mock location data
  updateLocationData();

  // Connect to Internet link
  const connectInternetLink = document.getElementById("connect-internet");
  if (connectInternetLink) {
    // Add attention-grabbing effect after page load
    setTimeout(() => {
      connectInternetLink.classList.add("highlight-animation");
      setTimeout(() => {
        connectInternetLink.classList.remove("highlight-animation");
      }, 2000);
    }, 1500);

    connectInternetLink.addEventListener("click", function (e) {
      e.preventDefault();
      // This will be replaced with an actual redirect to the auth page later
      alert("You will be redirected to the authentication page.");
      // Uncomment and modify the line below when ready to implement the redirect
      // window.location.href = '/auth-page';
    });
  }

  // Defer initialization slightly to ensure DOM is ready
  setTimeout(initTeltonika, 500);
});

// User authentication and role management
function initUserRoleManagement() {
  // Check if user role is already set
  let userRole = localStorage.getItem("userRole") || "user";

  // Set initial user interface based on role
  updateUIForRole(userRole);

  // Add login/logout functionality
  const loginToggle = document.getElementById("login-toggle");
  if (loginToggle) {
    loginToggle.addEventListener("click", function () {
      // Get the CURRENT userRole from localStorage (not from closure)
      userRole = localStorage.getItem("userRole") || "user";

      if (userRole === "admin") {
        // Log out
        localStorage.setItem("userRole", "user");
        updateUIForRole("user");
        loginToggle.textContent = "Admin Login";
      } else {
        // Show login dialog
        showLoginDialog();
      }
    });
  }
}

function showLoginDialog() {
  // Create modal if it doesn't exist
  let loginModal = document.getElementById("login-modal");
  if (!loginModal) {
    loginModal = document.createElement("div");
    loginModal.id = "login-modal";
    loginModal.className = "modal";
    loginModal.innerHTML = `
      <div class="modal-content">
        <h3>Admin Login</h3>
        <form id="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
          </div>
          <div class="modal-actions">
            <button type="button" id="cancel-login" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
        <p id="login-error" class="error-message" style="display: none; color: red;"></p>
      </div>
    `;
    document.body.appendChild(loginModal);

    // Setup event listeners
    document.getElementById("cancel-login").addEventListener("click", () => {
      loginModal.style.display = "none";
    });

    document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Simple authentication - in production, use a secure authentication system
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("userRole", "admin");
        updateUIForRole("admin");
        loginModal.style.display = "none";

        // Reset form for next login
        document.getElementById("login-form").reset();
        document.getElementById("login-error").style.display = "none";

        // Force reload events list to apply admin privileges
        const today = new Date();
        const dayKey = formatDateKey(today);
        if (typeof showEventsForDay === "function") {
          showEventsForDay(dayKey);
        }
      } else {
        document.getElementById("login-error").textContent =
          "Invalid credentials";
        document.getElementById("login-error").style.display = "block";
      }
    });
  } else {
    // Reset form for this login attempt
    const loginForm = document.getElementById("login-form");
    if (loginForm) loginForm.reset();

    const loginError = document.getElementById("login-error");
    if (loginError) loginError.style.display = "none";
  }

  // Show the modal
  loginModal.style.display = "flex";
}

function updateUIForRole(role) {
  // Get all admin-only elements
  const adminElements = document.querySelectorAll(".admin-only");

  if (role === "admin") {
    // Show admin elements
    adminElements.forEach((el) => {
      el.style.display = "";
    });

    // Make sure the "Add Activity" button is explicitly shown
    const addEventBtn = document.getElementById("add-event");
    if (addEventBtn) {
      addEventBtn.style.display = "block";
    }

    document.body.classList.add("admin-mode");

    // Add visual indicator to admin-only elements
    adminElements.forEach((el) => {
      el.classList.add("admin-active");
    });
  } else {
    // Hide admin elements
    adminElements.forEach((el) => {
      el.style.display = "none";
    });
    document.body.classList.remove("admin-mode");

    // Remove visual indicators
    document.querySelectorAll(".admin-active").forEach((el) => {
      el.classList.remove("admin-active");
    });
  }

  // Update login button text
  const loginToggle = document.getElementById("login-toggle");
  if (loginToggle) {
    loginToggle.textContent =
      role === "admin" ? "Logout (Admin)" : "Admin Login";
  }
}

function initFileUpload() {
  const programUpload = document.getElementById("program-upload");
  const uploadBtn = document.getElementById("upload-btn");
  const programDisplay = document.getElementById("program-display");

  if (programUpload && uploadBtn) {
    uploadBtn.addEventListener("click", function () {
      const file = programUpload.files[0];
      if (!file) {
        alert("Please select a file first");
        return;
      }

      // Check file type
      if (file.type.match("image.*")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          programDisplay.innerHTML = `<img src="${e.target.result}" alt="Daily Program" class="uploaded-image">`;
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        programDisplay.innerHTML = `
                  <div class="pdf-preview">
                      <div class="pdf-icon">📄</div>
                      <p>${file.name}</p>
                      <small>PDF uploaded successfully</small>
                  </div>
              `;
      } else {
        alert("Unsupported file type. Please upload an image or PDF.");
      }
    });
  }
}

function updateLocationData() {
  // The actual weather data will now be fetched from the API
  // Keep the mock data as fallback
  document.getElementById("latitude").textContent = "24.555° N";
  document.getElementById("longitude").textContent = "81.777° W";
  document.getElementById("location-description").textContent =
    "Near Nassau, Bahamas";

  // Fetch real weather data based on ship position
  fetchWeatherData(24.555, -81.777);
}

// Function to fetch weather data from Open-Meteo API
async function fetchWeatherData(lat, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`
    );

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Update UI with the weather data
    updateWeatherUI(data);

    console.log("Weather data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // If weather API fails, show a message but don't break the app
    document.getElementById("weather-temp").textContent = "Weather unavailable";
    document.getElementById("weather-icon").textContent = "⚠️";
    return null;
  }
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
  if (!data || !data.current) return;

  // Update temperature
  const tempEl = document.getElementById("weather-temp");
  if (tempEl) {
    tempEl.textContent = `${Math.round(data.current.temperature_2m)}°${
      data.current_units.temperature_2m
    }`;
  }

  // Update weather icon based on weather code
  const weatherIcon = getWeatherIcon(data.current.weather_code);
  const weatherIconEl = document.getElementById("weather-icon");
  if (weatherIconEl) {
    weatherIconEl.textContent = weatherIcon;
  }

  // Update humidity
  const humidityEl = document.getElementById("weather-humidity");
  if (humidityEl && data.current.relative_humidity_2m) {
    humidityEl.textContent = `${data.current.relative_humidity_2m}%`;
  }

  // Update wind
  const windEl = document.getElementById("weather-wind");
  if (
    windEl &&
    data.current.wind_speed_10m &&
    data.current.wind_direction_10m
  ) {
    const windDir = getWindDirection(data.current.wind_direction_10m);
    windEl.textContent = `${data.current.wind_speed_10m} km/h ${windDir}`;
  }

  // Update timestamp
  const now = new Date();
  const updateTimeEl = document.getElementById("update-time");
  if (updateTimeEl) {
    updateTimeEl.textContent = now.toLocaleTimeString();
  }
}

// Function to get the cardinal direction based on degrees
function getWindDirection(degrees) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const directionArrows = [
    "↓",
    "↙",
    "↙",
    "↙",
    "←",
    "↖",
    "↖",
    "↖",
    "↑",
    "↗",
    "↗",
    "↗",
    "→",
    "↘",
    "↘",
    "↘",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return `${directionArrows[index]} ${directions[index]}`;
}

// Function to get weather icon based on weather code
function getWeatherIcon(code) {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  switch (true) {
    case code === 0: // Clear sky
      return "☀️";
    case code === 1: // Mainly clear
      return "🌤️";
    case code === 2: // Partly cloudy
      return "⛅";
    case code === 3: // Overcast
      return "☁️";
    case code >= 45 && code <= 48: // Fog
      return "🌫️";
    case code >= 51 && code <= 55: // Drizzle
      return "🌦️";
    case code >= 56 && code <= 57: // Freezing Drizzle
      return "❄️";
    case code >= 61 && code <= 65: // Rain
      return "🌧️";
    case code >= 66 && code <= 67: // Freezing Rain
      return "🌨️";
    case code >= 71 && code <= 77: // Snow
      return "❄️";
    case code >= 80 && code <= 82: // Rain showers
      return "🌦️";
    case code >= 85 && code <= 86: // Snow showers
      return "🌨️";
    case code >= 95 && code <= 99: // Thunderstorm
      return "⛈️";
    default:
      return "🌈";
  }
}

// Calendar Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Calendar variables
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

  // Make these functions global so they can be used across different parts of code
  window.showEventsForDay = showEventsForDay;
  window.formatDateKey = formatDateKey;
  window.refreshCalendar = renderCalendar;

  // DOM Elements
  const calendarDays = document.getElementById("calendar-days");
  const currentMonthEl = document.getElementById("current-month");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");
  const eventsList = document.getElementById("events-list");
  const addEventBtn = document.getElementById("add-event");

  // Only create modal if it doesn't exist yet
  let modal = document.getElementById("event-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "event-modal";
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add New Activity</h3>
            <form id="event-form">
                <div class="form-group">
                    <label for="event-date">Date</label>
                    <input type="date" id="event-date" required>
                </div>
                <div class="form-group">
                    <label for="event-time">Time</label>
                    <input type="time" id="event-time" required>
                </div>
                <div class="form-group">
                    <label for="event-title">Activity</label>
                    <input type="text" id="event-title" placeholder="e.g. Morning Yoga" required>
                </div>
                <div class="form-group">
                    <label for="event-location">Location</label>
                    <input type="text" id="event-location" placeholder="e.g. Pool Deck">
                </div>
                <div class="form-group">
                    <label for="event-description">Description</label>
                    <textarea id="event-description" rows="3"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" id="cancel-event" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
  }

  // Initialize calendar
  renderCalendar();

  // Navigation
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      // Instead of moving by month, move back 4 days
      const today = new Date(currentYear, currentMonth, 1);
      today.setDate(today.getDate() - 4);
      currentMonth = today.getMonth();
      currentYear = today.getFullYear();
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
      // Instead of moving by month, move forward 4 days
      const today = new Date(currentYear, currentMonth, 1);
      today.setDate(today.getDate() + 4);
      currentMonth = today.getMonth();
      currentYear = today.getFullYear();
      renderCalendar();
    });
  }

  // Add event button (admin only)
  if (addEventBtn) {
    // Make sure the button is marked as admin-only
    if (!addEventBtn.classList.contains("admin-only")) {
      addEventBtn.classList.add("admin-only");
    }

    addEventBtn.addEventListener("click", () => {
      // Double check user is admin before showing modal
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "admin") {
        alert("You need to be logged in as an admin to add activities.");
        return;
      }

      const eventDateInput = modal.querySelector("#event-date");
      const today = new Date();
      eventDateInput.value = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      modal.style.display = "flex";
    });
  }

  // Modal controls
  const cancelEventBtn = modal.querySelector("#cancel-event");
  if (cancelEventBtn) {
    cancelEventBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  const eventForm = modal.querySelector("#event-form");
  if (eventForm) {
    eventForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Double check user is admin before adding event
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "admin") {
        alert("You need to be logged in as an admin to add activities.");
        return;
      }

      addNewEvent();
      modal.style.display = "none";
    });
  }

  // Render calendar
  function renderCalendar() {
    if (!calendarDays || !currentMonthEl) return;

    // Set header to show "Next 4 Days" instead of month/year
    const today = new Date();
    const endDateView = new Date(today);
    endDateView.setDate(today.getDate() + 3);

    const startMonthName = today.toLocaleDateString("en-US", {
      month: "short",
    });
    const endMonthName = endDateView.toLocaleDateString("en-US", {
      month: "short",
    });

    // If start and end month are the same, show once
    if (startMonthName === endMonthName) {
      currentMonthEl.textContent = `${startMonthName} ${today.getDate()} - ${endDateView.getDate()}, ${today.getFullYear()}`;
    } else {
      currentMonthEl.textContent = `${startMonthName} ${today.getDate()} - ${endMonthName} ${endDateView.getDate()}, ${today.getFullYear()}`;
    }

    // Clear calendar
    calendarDays.innerHTML = "";

    // Update weekdays to show just two columns
    const weekdaysEl = document.querySelector(".calendar-weekdays");
    if (weekdaysEl) {
      weekdaysEl.innerHTML =
        "<div>Today & Tomorrow</div><div>Next 2 Days</div>";
    }

    // Get today and next 3 days
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);

    // Set startDate to today
    startDate.setDate(startDate.getDate());

    // Add 4 days (today and the next 3 days)
    for (let i = 0; i < 4; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);

      const dayKey = formatDateKey(dayDate);
      const isToday = i === 0;

      // Format day name and date
      const dayName = dayDate.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = dayDate.getDate();
      const dayMonth = dayDate.toLocaleDateString("en-US", { month: "short" });

      // Create day element with formatted date
      const dayEl = createDayElement(
        `${dayName}, ${dayMonth} ${dayNum}`,
        isToday
      );

      // Add events for this day
      if (events[dayKey]) {
        const eventsContainer = document.createElement("div");
        eventsContainer.className = "calendar-day-events";
        events[dayKey].forEach((event) => {
          const eventEl = document.createElement("div");
          eventEl.className = "calendar-event";
          eventEl.textContent = `${event.time} ${event.title}`;
          eventEl.title = `${event.time} - ${event.title}\n${
            event.location || ""
          }\n${event.description || ""}`;
          eventsContainer.appendChild(eventEl);
        });
        dayEl.appendChild(eventsContainer);
      }

      // Click handler to view day's events
      dayEl.addEventListener("click", () => {
        showEventsForDay(dayKey);
      });

      calendarDays.appendChild(dayEl);
    }

    // Show today's events by default
    showEventsForDay(formatDateKey(today));
  }

  function createDayElement(dayLabel, isToday = false) {
    const dayEl = document.createElement("div");
    dayEl.className =
      "calendar-day" +
      (dayLabel === "" ? " empty" : "") +
      (isToday ? " today" : "");

    if (dayLabel !== "") {
      const dayNumberEl = document.createElement("div");
      dayNumberEl.className = "calendar-day-number";
      dayNumberEl.textContent = dayLabel;
      dayEl.appendChild(dayNumberEl);
    }

    return dayEl;
  }

  function showEventsForDay(dayKey) {
    if (!eventsList) return;

    eventsList.innerHTML = "";

    // Always reload the current user role when showing events
    const userRole = localStorage.getItem("userRole");

    if (events[dayKey] && events[dayKey].length > 0) {
      events[dayKey].forEach((event) => {
        const li = document.createElement("li");
        li.innerHTML = `
                    <span class="event-time">${event.time}</span>
                    <span class="event-title">${event.title}</span>
                    <span class="event-location">${event.location || ""}</span>
                `;

        // Add delete button for admin mode
        if (userRole === "admin") {
          const deleteBtn = document.createElement("button");
          deleteBtn.className = "delete-event-btn";
          deleteBtn.textContent = "✕";
          deleteBtn.title = "Delete activity";
          deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            // Confirm deletion
            if (!confirm("Are you sure you want to delete this activity?")) {
              return;
            }

            // Double check user is admin before deleting
            const currentRole = localStorage.getItem("userRole");
            if (currentRole !== "admin") {
              alert(
                "You need to be logged in as an admin to delete activities."
              );
              return;
            }

            // Remove this event
            events[dayKey] = events[dayKey].filter(
              (e) => !(e.time === event.time && e.title === event.title)
            );

            // Remove the entire day key if no events left
            if (events[dayKey].length === 0) {
              delete events[dayKey];
            }

            // Save to localStorage
            localStorage.setItem("calendarEvents", JSON.stringify(events));

            // Refresh display
            renderCalendar();
            showEventsForDay(dayKey);
          });
          li.appendChild(deleteBtn);
        }

        eventsList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.className = "empty-state";
      li.textContent = "No activities scheduled";
      eventsList.appendChild(li);
    }
  }

  function addNewEvent() {
    const form = modal.querySelector("#event-form");
    const date = form.querySelector("#event-date").value;
    const time = form.querySelector("#event-time").value;
    const title = form.querySelector("#event-title").value;
    const location = form.querySelector("#event-location").value;
    const description = form.querySelector("#event-description").value;

    const eventDate = new Date(date);
    const dayKey = formatDateKey(eventDate);

    if (!events[dayKey]) {
      events[dayKey] = [];
    }

    events[dayKey].push({
      time,
      title,
      location,
      description,
    });

    // Sort events by time
    events[dayKey].sort((a, b) => a.time.localeCompare(b.time));

    // Save to localStorage
    localStorage.setItem("calendarEvents", JSON.stringify(events));

    // Refresh display
    renderCalendar();
    showEventsForDay(dayKey);

    // Reset form
    form.reset();
  }

  function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
});

// Updated Teltonika integration
async function initTeltonika() {
  console.log("Initializing Teltonika integration...");

  // Make sure Leaflet is loaded
  if (typeof L === "undefined") {
    console.warn("Leaflet not loaded yet, waiting...");
    setTimeout(initTeltonika, 1000);
    return;
  }

  try {
    const position = await fetchShipPosition();
    if (position) {
      console.log("Position data received:", position);
      displayShipPosition(position);
      startShipPositionUpdates();
    } else {
      console.warn("No position data received");
      showGpsError("admin-only"); // Make error message admin-only
    }
  } catch (error) {
    console.error("Initialization failed:", error);
    showGpsError("admin-only"); // Make error message admin-only
  }
}

let shipPositionInterval;
let shipIcon, shipHeadingIcon;

function displayShipPosition(position) {
  console.log("Position data:", position);

  // Extract the actual position data from the nested structure
  let positionData;
  if (position && position.success && position.data) {
    if (position.data.success && position.data.data) {
      // Double nested
      positionData = position.data.data;
    } else {
      // Single nested
      positionData = position.data;
    }
  }

  // Make sure we have valid position data
  if (!positionData) {
    console.error("Invalid position data structure");
    return;
  }

  // Extract latitude, longitude and angle
  let lat = parseFloat(positionData.latitude);
  let lng = parseFloat(positionData.longitude);
  let rawAngle = parseFloat(positionData.angle || 0);

  // Make sure angle is a valid number
  if (isNaN(rawAngle)) {
    rawAngle = 0;
  }

  // Log the raw angle from the data
  console.log("Raw angle from GPS:", rawAngle);

  // Add this variable to adjust the rotation as needed
  // Adjust this offset value until the ship points in the right direction
  const angleOffset = 90; // Change this value to adjust rotation

  // Calculate the final rotation angle
  const finalAngle = (rawAngle + angleOffset) % 360;

  console.log("Final rotation angle:", finalAngle);

  // Check if we have valid coordinates
  if (isNaN(lat) || isNaN(lng)) {
    console.error(
      "Invalid coordinates:",
      positionData.latitude,
      positionData.longitude
    );
    return;
  }

  // Log the parsed coordinates and angle
  console.log("Parsed coordinates:", lat, lng, "angle:", rawAngle);

  // Add additional data to display
  const speed = parseFloat(positionData.speed) || 0;
  const satellites = positionData.satellites || "N/A";

  // Update the text display with the correct format
  const latEl = document.getElementById("latitude");
  const lngEl = document.getElementById("longitude");
  const locationDescEl = document.getElementById("location-description");

  if (latEl) latEl.textContent = lat.toFixed(6) + "° N";
  if (lngEl) lngEl.textContent = lng.toFixed(6) + "° E";

  // Display location description with additional info
  const speedKnots = (speed * 0.539957).toFixed(1); // Convert m/s to knots

  // Determine if the ship is in port or at sea based on speed
  // Ships typically move very slowly or not at all when in port
  let locationStatus;
  if (speedKnots < 1) {
    locationStatus = "In Port";
  } else {
    locationStatus = "At Sea";
  }

  if (locationDescEl) {
    locationDescEl.textContent = `${locationStatus} (${speedKnots} knots, ${satellites} satellites)`;
  }

  // Update timestamp
  const now = new Date();
  if (document.getElementById("update-time")) {
    document.getElementById("update-time").textContent =
      now.toLocaleTimeString();
  }

  // Fetch real weather data based on current ship position
  fetchWeatherData(lat, lng);

  // Check if Leaflet is available
  if (typeof L === "undefined") {
    console.error("Leaflet library not loaded yet. Map will not be displayed.");
    return;
  }

  // Get the map container
  const mapContainer = document.querySelector(".map-placeholder");
  if (!mapContainer) {
    console.error("Map container not found");
    return;
  }

  try {
    // Create a rotating ship marker using CSS and a div icon
    const markerHtml = `
      <div class="ship-icon" style="transform: rotate(${finalAngle}deg)">
        <img src="img/ship.png" width="32" height="32">
      </div>
    `;

    // Create or update the custom CSS for the rotating ship icon
    if (!document.getElementById("ship-icon-style")) {
      const shipIconStyle = document.createElement("style");
      shipIconStyle.id = "ship-icon-style";
      shipIconStyle.textContent = `
        .ship-icon {
          width: 32px;
          height: 32px;
          transform-origin: center center;
        }
        .ship-icon img {
          width: 100%;
          height: 100%;
        }
        .leaflet-marker-icon {
          background: transparent;
          border: none;
        }
      `;
      document.head.appendChild(shipIconStyle);
    }

    // Create a custom icon with rotation applied
    const rotatedShipIcon = L.divIcon({
      className: "leaflet-marker-icon",
      html: markerHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    // If map container is empty or doesn't have our map yet
    if (!window.shipMap || !document.getElementById("ship-map")) {
      console.log("Initializing new map");

      // Clear the container first
      mapContainer.innerHTML = "";

      // Create a map element
      const mapElement = document.createElement("div");
      mapElement.id = "ship-map";
      mapElement.style.width = "100%";
      mapElement.style.height = "100%";
      mapContainer.appendChild(mapElement);

      // Initialize the map with correct coordinates
      window.shipMap = L.map("ship-map").setView([lat, lng], 10);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(window.shipMap);

      // Add ship marker with rotated icon
      window.shipMarker = L.marker([lat, lng], { icon: rotatedShipIcon }).addTo(
        window.shipMap
      );
      window.shipMarker
        .bindPopup(`Ship's Position: ${lat.toFixed(6)}°N, ${lng.toFixed(6)}°E`)
        .openPopup();

      // Force a resize event to ensure map renders properly
      setTimeout(() => {
        window.shipMap.invalidateSize();
      }, 100);
    } else {
      // Map exists, just update marker position and rotation
      console.log("Updating existing map");

      // Update marker position and icon with new rotation
      if (window.shipMarker) {
        window.shipMarker.setLatLng([lat, lng]);
        window.shipMarker.setIcon(rotatedShipIcon);
        window.shipMarker.setPopupContent(
          `Ship's Position: ${lat.toFixed(6)}°N, ${lng.toFixed(6)}°E`
        );
      }

      // Center map on marker
      if (window.shipMap) {
        window.shipMap.setView([lat, lng], window.shipMap.getZoom());
        window.shipMap.invalidateSize();
      }
    }
  } catch (e) {
    console.error("Error with map:", e);
    mapContainer.innerHTML =
      '<div class="error">Error with map: ' + e.message + "</div>";
  }
}

let isFetching = false;

async function fetchShipPosition() {
  if (isFetching) {
    return null;
  }

  isFetching = true;
  try {
    // Add timeout to the fetch to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    console.log("Attempting to fetch ship position...");
    const response = await fetch("http://localhost:3001/api/ship/position", {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Debug the API response
    console.log("API response:", data);

    // The API response has an extra nesting level
    // It's {success: true, data: {success: true, data: {...}}}
    let position;
    if (data && data.success && data.data) {
      if (data.data.success && data.data.data) {
        // Double nested
        position = data.data.data;
      } else {
        // Single nested
        position = data.data;
      }

      // Validate coordinates
      const lat = parseFloat(position.latitude);
      const lng = parseFloat(position.longitude);

      console.log("Parsed coordinates from API:", lat, lng);

      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates in API response");
      }
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Fetch timeout: The request took too long to complete");
    } else {
      console.error("Fetch error:", error);
    }
    return null;
  } finally {
    isFetching = false;
  }
}

function startShipPositionUpdates() {
  // Clear any existing interval
  if (window.shipPositionInterval) {
    clearInterval(window.shipPositionInterval);
  }

  // Set a new interval - 3 seconds instead of 5 seconds
  window.shipPositionInterval = setInterval(async () => {
    const position = await fetchShipPosition();
    if (position) {
      displayShipPosition(position);
    }
  }, 3000); // 3 seconds
}

function showGpsError(cssClass = "") {
  const locationSection = document.getElementById("ship-location");
  if (!locationSection) return;

  // Check if error already exists
  if (document.querySelector(".gps-error")) return;

  const errorDiv = document.createElement("div");
  errorDiv.className = `gps-error ${cssClass}`;
  errorDiv.innerHTML = `
    <p>⚠️ GPS tracking temporarily unavailable</p>
    <button id="retry-gps" class="btn btn-secondary">Retry</button>
  `;
  locationSection.appendChild(errorDiv);

  const retryBtn = document.getElementById("retry-gps");
  if (retryBtn) {
    retryBtn.addEventListener("click", initTeltonika);
  }
}

// Add this CSS
const style = document.createElement("style");
style.textContent = `
.gps-error {
    background: #fff3e0;
    padding: 15px;
    border-radius: 4px;
    margin-top: 20px;
    text-align: center;
    border: 1px solid #ffb74d;
}
.gps-error p {
    color: #e65100;
    margin-bottom: 10px;
}

.map-placeholder {
  position: relative;
  min-height: 300px;
  width: 100%;
  background-color: #f5f5f5;
}

#ship-map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.loading, .error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 0;
}

/* Admin mode indicator */
body.admin-mode:before {
  content: "ADMIN MODE";
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  z-index: 9999;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
}

/* Active admin styling */
.admin-active {
  border: 2px dashed rgba(0, 0, 0, 0.3) !important;
  position: relative;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.admin-active:after {
  content: "Admin Only";
  position: absolute;
  top: -10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 3px;
  letter-spacing: 0.5px;
}
`;

// Defer initialization slightly to ensure DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Add the style to the document
  document.head.appendChild(style);

  // Additional styles specific to the admin features
  const adminStyleElement = document.createElement("style");
  adminStyleElement.textContent = `
    /* For highlighting admin elements */
    .admin-only button, .admin-only input {
      cursor: pointer !important;
    }

    /* Make admin elements visible when in admin mode */
    body.admin-mode .admin-only {
      display: block !important;
    }

    /* Style for the Add Activity button in admin mode */
    body.admin-mode #add-event {
      display: block !important;
      margin: 10px auto;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    
    body.admin-mode #add-event:hover {
      background-color: black;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    /* Style for delete button visibility */
    .delete-event-btn {
      opacity: 1 !important;
      visibility: visible !important;
      display: inline-block !important;
      background-color: rgba(0, 0, 0, 0.1);
      color: #333 !important;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      line-height: 20px;
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .delete-event-btn:hover {
      background-color: rgba(0, 0, 0, 0.7);
      color: white !important;
      transform: scale(1.1);
    }
    
    /* Modal custom styles to ensure they're visible */
    #login-modal {
      z-index: 2000 !important;
    }
    
    #login-modal .modal-content {
      border-top: 4px solid #000;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
    
    #login-modal h3 {
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
      color: #000;
      margin-bottom: 25px;
    }
    
    #login-modal input {
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 10px 12px;
      transition: all 0.3s ease;
    }
    
    #login-modal input:focus {
      border-color: #000;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    }
    
    #login-modal .btn-primary {
      background-color: #000;
      border-color: #000;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    #login-modal .btn-primary:hover {
      background-color: #333;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    #event-modal {
      z-index: 1500 !important;
    }
  `;
  document.head.appendChild(adminStyleElement);

  // Initialize all components

  // Check if localStorage is working - if not, display error
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
  } catch (e) {
    console.error(
      "LocalStorage not available. Admin functionality requires localStorage."
    );
    alert(
      "Warning: LocalStorage is not available. Admin functionality will not work correctly."
    );
  }

  // Reset any stale admin state on page load (optional)
  // Uncomment if you want to force users to login again each time the page loads
  // localStorage.setItem('userRole', 'user');

  // Update UI based on current role
  const currentRole = localStorage.getItem("userRole") || "user";
  updateUIForRole(currentRole);

  // Wait a bit to make sure everything is loaded before initializing map
  setTimeout(initTeltonika, 500);
});
