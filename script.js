fetch("users.json")
  .then(res => res.json())
  .then(users => {

    // =========================
    // CONTAINER
    // =========================

    let container = document.querySelector("#bubbleContainer");

    if (!container) {
      container = document.createElement("div");
      container.id = "bubbleContainer";
      container.className = "bubble-container";
      document.body.appendChild(container);
    }


    // =========================
    // SHOW LATEST 3 USERS
    // =========================

    const visibleUsers = users.slice(-3);


    // =========================
    // RESPONSIVE GAP
    // =========================

    let gap = window.innerWidth * 0.12;
    gap = Math.max(25, Math.min(gap, 70));


    // =========================
    // POSITIONS
    // =========================

    const positions = [
      { left: 0,       bottom: 0 },
      { left: gap,     bottom: gap * 0.6 },
      { left: gap * 2, bottom: 0 }
    ];


    // =========================
    // CREATE POPUP
    // =========================

    const popup = document.createElement("div");
    popup.className = "popup";

    popup.innerHTML = `
      <div class="popup-content">

        <div class="popup-user">
          <img id="popupAvatar" />
          <div class="popup-text">
            <h3><span id="popupName"></span></h3>
            <p id="popupMsg"></p>
          </div>
        </div>

        <div class="message-bar">
          <input
            type="text"
            id="msgInput"
            placeholder="Message on WhatsApp..."
          />
          <button id="sendBtn">Send</button>
        </div>

      </div>
    `;

    document.body.appendChild(popup);


    // =========================
    // CREATE BUBBLES
    // =========================

    visibleUsers.forEach((user, index) => {

      const bubble = document.createElement("div");
      bubble.className = "bubble";

      // POSITION
      bubble.style.left   = positions[index].left   + "px";
      bubble.style.bottom = positions[index].bottom + "px";

      // ANIMATION — FIX: use bwFloat to match renamed keyframe
      bubble.style.animationName     = "bwFloat";
      bubble.style.animationDuration = `${2.5 + Math.random()}s`;
      bubble.style.animationDelay    = `${Math.random()}s`;

      // IMAGE
      bubble.innerHTML = `<img src="${user.avatar}" alt="${user.name}" />`;


      // =========================
      // CLICK BUBBLE
      // =========================

      bubble.addEventListener("click", (e) => {

        e.stopPropagation(); // FIX: prevent click bubbling to host page

        document.getElementById("popupName").textContent  = user.name;
        document.getElementById("popupMsg").textContent   = user.review;
        document.getElementById("popupAvatar").src        = user.avatar;
        document.getElementById("msgInput").value         = "";

        popup.classList.add("show");


        // =========================
        // SEND BUTTON
        // =========================

        document.getElementById("sendBtn").onclick = () => {

          const input = document.getElementById("msgInput");
          const msg   = input.value.trim();

          if (!msg) return;

          const waLink = `https://api.whatsapp.com/send?phone=${user.phone}&text=${encodeURIComponent(msg)}`;

          window.open(waLink, "_blank");

          input.value = "";
        };


        // =========================
        // ENTER KEY SEND
        // =========================

        document.getElementById("msgInput").onkeydown = (e) => {
          if (e.key === "Enter") {
            document.getElementById("sendBtn").click();
          }
        };

      });

      container.appendChild(bubble);
    });


    // =========================
    // CLICK OUTSIDE TO CLOSE
    // =========================

    // FIX: listen on document, not popup wrapper (since popup is not full-screen anymore)
    document.addEventListener("click", (e) => {
      if (!popup.contains(e.target) && !e.target.closest(".bubble")) {
        popup.classList.remove("show");
      }
    });

  });