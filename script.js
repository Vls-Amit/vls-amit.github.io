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
  { left: 40, bottom: 0  },  // bottom-right
  { left: 20, bottom: 35 }   // top-center
];

    // =========================
    // CREATE POPUP
    // =========================

    const popup =
      document.createElement("div");

    popup.className = "popup";



    popup.innerHTML = `

      <div class="popup-content">

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




    // =========================
    // CREATE BUBBLES
    // =========================

    visibleUsers.forEach((user, index) => {

      // CREATE
      const bubble =
        document.createElement("div");

      bubble.className = "bubble";



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
