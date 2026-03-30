console.log("JS is working");
let courseData = {};
let hostelData = {};
let feesData = {};
let facultyData = {};
let collegeData = {};
let faqData = {};
let selectedCourse = "";
let timingData = {
    firstSecondYear: "8:40 AM - 2:50 PM",
    thirdYear: "8:40 AM - 12:50 PM",
    sunday: "Holiday"
};

// ================== chat toggle ==================

function toggleChat() {
    const chat = document.getElementById("chatbot");
    const body = document.body;
    const toggleBtn = document.getElementById("chat-toggle");

    chat.classList.toggle("chat-visible");
    body.classList.toggle("chat-open");

    // 🔥 hide/show button
    if (chat.classList.contains("chat-visible")) {
        toggleBtn.style.display = "none";
    } else {
        toggleBtn.style.display = "block";
    }
}

// ================== mic code ==================

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN"; // good for Indian accent
    recognition.continuous = false;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("userInput").value = transcript;
    };

    recognition.onerror = function(event) {
        console.error("Mic error:", event.error);
    };

    window.startMic = function () {
        recognition.start();
    };

} else {
    alert("Speech Recognition not supported in this browser");
}


// ================= LOAD ALL JSON =================

fetch("data/courseDetails.json")
.then(res => res.json())
.then(data => courseData = data);

fetch("data/hostel.json")
.then(res => res.json())
.then(data => hostelData = data);

fetch("data/fees.json")
.then(res => res.json())
.then(data => feesData = data);

fetch("data/faculty.json")
.then(res => res.json())
.then(data => facultyData = data);

fetch("data/collegeInfo.json")
.then(res => res.json())
.then(data => collegeData = data);

fetch("data/faq.json")
.then(res => res.json())
.then(data => faqData = data);

// ================= UI FUNCTIONS =================

function botReply(text) {
    addMessage("Typing...", "bot");

    setTimeout(() => {
        let lastBot = document.querySelector("#chatbox .bot:last-child");
        if (lastBot) lastBot.remove();
        addMessage(text, "bot");
    }, 500);
}

function addMessage(text, sender) {
    let chatbox = document.getElementById("chatbox");

    let msg = document.createElement("div");
    msg.className = sender;

    let bubble = document.createElement("div");
    bubble.innerHTML = text;

    bubble.style.background = sender === "user" ? "#800000" : "#f5f5f5";
    bubble.style.color = sender === "user" ? "white" : "black";
    bubble.style.padding = "10px 14px";
    bubble.style.borderRadius = "15px";
    bubble.style.margin = "5px";
    bubble.style.display = "inline-block";
    bubble.style.maxWidth = "75%";

    msg.appendChild(bubble);
    chatbox.appendChild(msg);

    chatbox.scrollTop = chatbox.scrollHeight;
}

// ================= COURSE =================

function selectCourse(course) {
    selectedCourse = course;

    addMessage("You selected " + course.toUpperCase(), "user");

    botReply(`
        <b>Select category:</b><br><br>
        <button onclick="handleCategory('syllabus')">Syllabus</button>
        <button onclick="handleCategory('faculty')">Faculty</button>
        <button onclick="handleCategory('hostel')">Hostel</button><br><br>
        <button onclick="handleCategory('fees')">Fees</button>
        <button onclick="handleCategory('admission')">Admission</button>
        <button onclick="handleCategory('college')">College Info</button>
    `);
}

// ================= CATEGORY =================

function handleCategory(category) {
    addMessage(category, "user");

    // SYLLABUS
    if (category === "syllabus") {
        let semesters = Object.keys(courseData[selectedCourse]?.semesters || {});
        let buttons = semesters.map(sem =>
            `<button onclick="showSemester('${sem}')">${sem.toUpperCase()}</button>`
        ).join(" ");
        return botReply("Select Semester:<br><br>" + buttons);
    }

    // HOSTEL
    if (category === "hostel") {
        let hostel = hostelData.hostel?.[0];

        if (!hostel) return botReply("Hostel info not available");

        return botReply(`
            <b>🏠 Hostel Info</b><br><br>
            ${hostel.availability}<br>
            ${hostel.type}<br>
            ${hostel.rooms}<br>
            ${hostel.fees}<br>
            ${hostel.facilities}<br>
            ${hostel.study_hours}<br>
            ${hostel.rules}<br>
            ${hostel.mess}<br>
            ${hostel.maintanance}<br>
            ${hostel.housekeeping}<br>
            ${hostel.fitness}<br><br>
            ${hostel.contact}
        `);
    }

    // FEES
    if (category === "fees") {
        let fees = feesData.fees;

        if (!fees) return botReply("Fees not available");

        let output = `<b>💰 Fees</b><br><br>`;
        fees.forEach(f => {
            output += `${f.course} → ${f.amount}<br>`;
        });

        return botReply(output);
    }

    // FACULTY
   if (category === "faculty") {

    if (!selectedCourse) {
        return botReply("Please select a course first (BCA or BBA)");
    }

    let faculty = facultyData[selectedCourse];

    if (!faculty || faculty.length === 0) {
        return botReply("Faculty info not available");
    }

    let output = `<b>👩‍🏫 Faculty (${selectedCourse.toUpperCase()})</b><br><br>`;

    faculty.forEach(f => {
        output += `
            <div style="margin-bottom:15px;">
                <img src="${f.image}" width="70"><br>
                <b>${f.name}</b><br>
                ${f.position}<br>
                Qualification: ${f.qualification}<br>
                Experience: ${f.experience}<br>
            </div>
        `;
    });

    return botReply(output);
}

    // ADMISSION
    if (category === "admission") {
        return botReply(`
            <b>🎓 Admission</b><br><br>
            Online & Offline available<br>
            📞 Call: 9876543210
        `);
    }

    // COLLEGE
    
    if (category === "college") {
    let college = collegeData.college;

    if (!college) return botReply("College info not available");

    return botReply(`
        <b>🏫 ${college.name}</b><br><br>
        📍 ${college.location}<br><br>

        <img src="${college.image}" width="200"><br><br>

        🔗 <b>Connect with us:</b><br><br>

        <a href="https://www.instagram.com/vsbm_bargarh_2011?igsh=MWVpOWltcnRxczFmZg==" target="_blank" style="color:#E1306C;">
            📸 Instagram
        </a><br><br>

        <a href="https://www.facebook.com/share/1AtRhUWE7B/" target="_blank" style="color:#1877F2;">
            👍 Facebook
        </a>
    `);
}
}
// ================= SYLLABUS =================

function showSemester(sem) {
    addMessage(sem, "user");

    let subjects = Object.keys(courseData[selectedCourse].semesters[sem] || {});
    let buttons = subjects.map(sub =>
        `<button onclick="showSubject('${sem}','${sub}')">${sub}</button>`
    ).join(" ");

    botReply("Select Subject:<br><br>" + buttons);
}

function showSubject(sem, subject) {
    addMessage(subject, "user");

    let units = courseData[selectedCourse].semesters[sem][subject];

    if (!units) return botReply("No data");

    let output = `<b>${subject}</b><br><br>`;
    for (let unit in units) {
        output += `<b>${unit}</b>: ${units[unit].join(", ")}<br>`;
    }

    botReply(output);
}

//-------smart reply based on keywords in user input-------

function getSmartReply(input) {
    input = input.toLowerCase();

    if (input.includes("fee") || input.includes("price") || input.includes("cost")) {
        return "fees";
    }

    if (input.includes("hostel") || input.includes("stay") || input.includes("room")) {
        return "hostel";
    }

    if (input.includes("teacher") || input.includes("faculty") || input.includes("staff")) {
        return "faculty";
    }

    if (input.includes("admission") || input.includes("apply") || input.includes("join")) {
        return "admission";
    }

    if (input.includes("today") || input.includes("open today") || input.includes("college open today")) {

    return "todayStatus";
    }


    // 🔥 timing FIRST
    if (
        input.includes("timing") ||
        input.includes("time") ||
        input.includes("college hours") ||
        input.includes("working hours") 
    ) {
        return "timing";
    }

    // 👇 MOVE THESE INSIDE
    if (input.includes("college") || input.includes("about") || input.includes("info")) {
        return "college";
    }

    if (input.includes("instagram") || input.includes("facebook") || input.includes("social")) {
        return "social";
    }

    if (input.includes("bca")) return "bca";
    if (input.includes("bba")) return "bba";

        return null;
}

// ================= SEND =================

function sendMessage() {
    let inputBox = document.getElementById("userInput");
    let originalInput = inputBox.value.trim();
    let input = originalInput.toLowerCase();

    if (!input) return;

    addMessage(input, "user");
    inputBox.value = "";

    // GREETING
    if (input.includes("hi") || input.includes("hello") || input.includes("hey") || input.includes("good morning") || input.includes("good afternoon") || input.includes("good evening") || input.includes("greetings") || input.includes("namaste") || input.includes("hyllo") || input.includes("hii") || input.includes("hiii") || input.includes("hy") || input.includes("greet")) {
    let hour = new Date().getHours();
    let greet = hour < 12 ? "Good morning ☀️" :
                hour < 18 ? "Good afternoon 🌤️" :
                "Good evening 🌙";

    return botReply(`
        ${greet}! 👋<br>
        Ask anything like:<br>
        • Admission<br>
        • Hostel<br>
        • Fees<br><br>
        <button onclick="selectCourse('bca')">BCA</button>
        <button onclick="selectCourse('bba')">BBA</button>
    `);
}

    // PRINCIPAL
    if (input.includes("principal")) {
        let faculty = facultyData.faculty;
        let principal = faculty?.find(f =>
            f.position.toLowerCase().includes("principal")
        );

        if (principal) {
            return botReply(`
                👨‍🏫 Principal:<br>
                <img src="${principal.image}" width="80"><br>
                <b>${principal.name}</b><br>
                ${principal.position}
            `);
        }
    }

    // SMART MATCHING
let smart = getSmartReply(input);

if (smart === "social") {
    return botReply(`
        
        🔗 <b>Follow us:</b><br><br>

        <a href="https://www.instagram.com/vsbm_bargarh_2011?igsh=MWVpOWltcnRxczFmZg==" target="_blank" style="color:#E1306C;">
            📸 Instagram
        </a><br><br>

        <a href="https://www.facebook.com/share/1AtRhUWE7B/" target="_blank" style="color:#1877F2;">
            👍 Facebook
        </a>
    `);
}
if (smart === "timing") {
    return botReply(`
        📅 <b>College Timings</b><br><br>

        🎓 BBA & BCA<br><br>

        👉 1st & 2nd Year:<br>
        ${timingData.firstSecondYear}<br><br>

        👉 3rd Year:<br>
        ${timingData.thirdYear}<br><br>

        📅 Sunday:<br>
        ${timingData.sunday}
    `);
}
if (smart === "todayStatus") {
    let day = new Date().getDay();

    if (day === 0) {
        return botReply("📅 Today is Sunday. College is closed.");
    } else {
        return botReply("📅 College is open today.");
    }
}
if (smart === "hostel") return handleCategory("hostel");
if (smart === "fees") return handleCategory("fees");
if (smart === "faculty") return handleCategory("faculty");
if (smart === "admission") return handleCategory("admission");
if (smart === "college") return handleCategory("college");

if (smart === "bca") return selectCourse("bca");
if (smart === "bba") return selectCourse("bba");

    

    // FAQ
    if (faqData.faq) {
        let match = faqData.faq.find(f =>
            input.includes(f.question.toLowerCase())
        );
        if (match) return botReply(match.answer);
    }

    botReply("Please use buttons or type valid query 😊");
}

// ================= ENTER KEY =================
window.onload = function () {
    document.getElementById("userInput").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
};