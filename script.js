const style = document.createElement("style");

style.textContent = `
.bubble-container {
  position: fixed !important;
  left: 20px !important;
  bottom: 20px !important;
  z-index: 2147483647 !important;
}

.bubble {
  position: absolute !important;
}
`;

document.head.appendChild(style);

fetch("https://vls-amit.github.io/users.json")
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

    console.log("Final container:", container);

    // =========================
    // SHOW LATEST 3 USERS
    // =========================

    const visibleUsers =
      users.slice(-3);



    // =========================
    // RESPONSIVE GAP
    // =========================

    let gap =
      window.innerWidth * 0.12;

    gap =
      Math.max(25, Math.min(gap, 70));



    // =========================
    // POSITIONS
    // =========================

    const positions = [
  { left: 0,  bottom: 0  },  // bottom-left
  { left: 70, bottom: 0  },  // bottom-right
  { left: 35, bottom: 60 }   // top-center
];

    // =========================
    // CREATE POPUP
    // =========================

    const popup =
      document.createElement("div");

    popup.className = "popup";



    popup.innerHTML = `

      <div class="popup-content">

      <button class="close-popup">&times;</button>

        <div class="drag-handle"></div>


        <div class="popup-user">

          <img id="popupAvatar" />

          <div class="popup-text">

            <h3>

              <span id="popupName"></span>

            </h3>

            <p id="popupMsg"></p>

          </div>

        </div>

        <div class="message-bar">

          <input
            type="text"
            id="msgInput"
            placeholder="Message..."
          />

          <button id="sendBtn">
            Send
          </button>

        </div>

      </div>

    `;

    document.body.appendChild(popup);
    popup.querySelector(".close-popup")
  .addEventListener("click", () => {
    popup.classList.remove("show");
  });

    // =========================
    // CREATE BUBBLES
    // =========================

    visibleUsers.forEach((user, index) => {

      // CREATE
      const bubble =
        document.createElement("div");

      bubble.className = "bubble";
      const animations = [
      "float1",
      "float2",
      "float3"
     ];

      bubble.style.animation =
      `${animations[index]} ${2 + Math.random() * 2}s ease-in-out infinite`;



      // POSITION
      bubble.style.left =
        positions[index].left + "px";

      bubble.style.bottom =
        positions[index].bottom + "px";


      // IMAGE
      bubble.innerHTML = `
        <img
          src="${user.avatar}"
          alt="${user.name}"
        />
      `;



      // =========================
      // CLICK BUBBLE
      // =========================

      bubble.addEventListener("click", () => {

        // USER INFO
        document.getElementById("popupName")
          .textContent = user.name;

        document.getElementById("popupMsg")
          .textContent = user.review;

        document.getElementById("popupAvatar")
          .src = user.avatar;



        // CLEAR OLD MESSAGE
        document.getElementById("msgInput")
          .value = "";



        // SHOW POPUP
        popup.classList.add("show");  

        // =========================
        // SEND BUTTON
        // =========================

        document.getElementById("sendBtn")
          .onclick = () => {

            const input =
              document.getElementById("msgInput");

            const msg =
              input.value.trim();

            if (!msg) return;



            const encoded =
              encodeURIComponent(msg);



            const waLink =
              `https://api.whatsapp.com/send?phone=${user.phone}&text=${encoded}`;



            console.log(waLink);



            window.open(
              waLink,
              "_blank"
            );



            // CLEAR INPUT
            input.value = "";

          };



        // =========================
        // ENTER KEY SEND
        // =========================

        document.getElementById("msgInput")
          .onkeydown = (e) => {

            if (e.key === "Enter") {

              document.getElementById("sendBtn")
                .click();

            }

          };

      });



      // ADD TO SCREEN
      console.log("container =", container);
      console.log("bubble =", bubble);

      container.appendChild(bubble);

    });




    // =========================
    // CLICK OUTSIDE TO CLOSE
    // =========================

    popup.addEventListener("click", (e) => {

      if (e.target === popup) {

        popup.classList.remove("show");

      }

    });

  });
