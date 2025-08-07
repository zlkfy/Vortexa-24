document.addEventListener("DOMContentLoaded", () => {
  // Get references to DOM elements
  const searchIcon = document.getElementById("searchIcon");
  const searchOverlay = document.getElementById("searchOverlay");
  const closeSearch = document.getElementById("closeSearch");
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  const hamburgerOverlay = document.getElementById("hamburgerOverlay");
  const closeHamburger = document.getElementById("closeHamburger");
  const navMenu = document.querySelector(".nav-menu");
  const hamburgerMenuLinks = document.querySelectorAll("#hamburgerOverlay a");

  // Member Overlay Elements
  const memberCards = document.querySelectorAll(".member-card");
  const memberOverlay = document.getElementById("memberOverlay");
  const closeMemberOverlay = document.getElementById("closeMemberOverlay");
  const overlayMemberPhoto = document.getElementById("overlayMemberPhoto");
  const overlayMemberName = document.getElementById("overlayMemberName");
  const overlayMemberOrigin = document.getElementById("overlayMemberOrigin"); // Akan disembunyikan
  const overlayMemberInstagram = document.getElementById(
    "overlayMemberInstagram"
  ); // Akan disembunyikan
  const overlayMemberBio = document.getElementById("overlayMemberBio"); // Ini akan menampilkan 'data-member-bio'

  // NEW: Member Navigation Elements
  const prevMemberButton = document.getElementById("prevMemberButton");
  const nextMemberButton = document.getElementById("nextMemberButton");
  const memberSlideIndicator = document.getElementById("memberSlideIndicator");
  const memberDetailContent = memberOverlay.querySelector(
    ".member-detail-content"
  );

  let currentMemberIndex = 0; // To keep track of the current member shown

  // Moment Overlay Elements
  const momentItems = document.querySelectorAll(".moment-item");
  const momentOverlay = document.getElementById("momentOverlay");
  const closeMomentOverlay = document.getElementById("closeMomentOverlay");
  const overlayMomentImage = document.getElementById("overlayMomentImage");
  const overlayMomentCaption = document.getElementById("overlayMomentCaption");

  // NEW: Moment Navigation Elements
  const prevMomentButton = document.getElementById("prevMomentButton");
  const nextMomentButton = document.getElementById("nextMomentButton");
  const momentSlideIndicator = document.getElementById("momentSlideIndicator");
  const momentImageContent = momentOverlay.querySelector(
    ".moment-image-content"
  );

  let currentMomentIndex = 0; // To keep track of the current moment shown

  /**
   * Helper function to toggle body scroll
   */
  const toggleBodyScroll = (disableScroll) => {
    document.body.style.overflow = disableScroll ? "hidden" : "";
  };

  /**
   * Common function to open any overlay
   * @param {HTMLElement} overlayElement - The overlay div to open
   */
  const openOverlay = (overlayElement) => {
    overlayElement.classList.add("active");
    toggleBodyScroll(true);
  };

  /**
   * Common function to close any overlay
   * @param {HTMLElement} overlayElement - The overlay div to close
   */
  const closeOverlay = (overlayElement) => {
    overlayElement.classList.remove("active");
    toggleBodyScroll(false);
  };

  /**
   * --- Search Overlay Logic ---
   */
  searchIcon.addEventListener("click", () => openOverlay(searchOverlay));
  closeSearch.addEventListener("click", () => closeOverlay(searchOverlay));
  searchOverlay.addEventListener("click", (event) => {
    if (event.target === searchOverlay) closeOverlay(searchOverlay);
  });

  /**
   * --- Hamburger Menu Logic ---
   */
  hamburgerIcon.addEventListener("click", () => openOverlay(hamburgerOverlay));
  closeHamburger.addEventListener("click", () =>
    closeOverlay(hamburgerOverlay)
  );
  hamburgerOverlay.addEventListener("click", (event) => {
    if (event.target === hamburgerOverlay) closeOverlay(hamburgerOverlay);
  });
  hamburgerMenuLinks.forEach((link) => {
    link.addEventListener("click", () => closeOverlay(hamburgerOverlay));
  });

  /**
   * --- Smooth Scrolling for Navigation Links ---
   */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /**
   * --- Responsive Navbar Toggle ---
   */
  const checkNavbarDisplay = () => {
    if (window.innerWidth <= 992) {
      hamburgerIcon.style.display = "block";
      navMenu.style.display = "none";
    } else {
      hamburgerIcon.style.display = "none";
      navMenu.style.display = "flex";
    }
  };
  checkNavbarDisplay();
  window.addEventListener("resize", checkNavbarDisplay);

  // --- NEW: Member Detail Overlay Logic ---

  // Function to populate and show a specific member
  const showMember = (index, direction = "none") => {
    if (index < 0 || index >= memberCards.length) return; // Boundary check

    const currentCard = memberCards[index];

    // --- AMBIL DATA DARI ATRIBUT data-* PADA MEMBER-CARD ---
    // Mengambil foto dari data-member-photo
    const memberImage = currentCard.dataset.memberPhoto || "";
    // Mengambil nama dari data-member-name
    const memberNameForOverlay =
      currentCard.dataset.memberName || "Nama Tidak Ditemukan";
    // Mengambil 'data-member-bio' untuk dijadikan sebagai motivasi di overlay
    const memberBioForOverlay =
      currentCard.dataset.memberBio || "Kata-kata motivasi tidak tersedia.";

    // Data ini kita set dummy atau kosong karena tidak akan ditampilkan di overlay
    const dummyRole = "";
    const dummyInstagramLink = "#";
    const dummyInstagramHandle = "";
    // --- AKHIR PENGAMBILAN DATA ---

    // Apply slide-out animation to current content if not initial load
    if (direction !== "none") {
      memberDetailContent.classList.add(
        direction === "next" ? "slide-out-left" : "slide-out-right"
      );
      memberDetailContent.addEventListener("animationend", function handler() {
        memberDetailContent.classList.remove(
          "slide-out-left",
          "slide-out-right"
        );
        // Immediately set new content after slide-out animation
        updateMemberContent(
          memberImage, // Kirim foto
          memberNameForOverlay, // Kirim nama
          memberBioForOverlay, // Kirim data-member-bio sebagai 'motivasiText'
          dummyRole, // Kirim dummy
          dummyInstagramLink, // Kirim dummy
          dummyInstagramHandle // Kirim dummy
        );
        memberDetailContent.classList.add(
          direction === "next" ? "slide-in-right" : "slide-in-left"
        );
        memberDetailContent.addEventListener(
          "animationend",
          function handler2() {
            memberDetailContent.classList.remove(
              "slide-in-right",
              "slide-in-left"
            );
            memberDetailContent.removeEventListener("animationend", handler2);
          }
        );
        this.removeEventListener("animationend", handler);
      });
    } else {
      // No animation for initial display
      updateMemberContent(
        memberImage,
        memberNameForOverlay,
        memberBioForOverlay, // Kirim data-member-bio sebagai 'motivasiText'
        dummyRole,
        dummyInstagramLink,
        dummyInstagramHandle
      );
    }

    currentMemberIndex = index;
    memberSlideIndicator.textContent = `${currentMemberIndex + 1}/${
      memberCards.length
    }`;

    // Show/hide navigation buttons if at start/end
    prevMemberButton.classList.toggle("hidden", currentMemberIndex === 0);
    nextMemberButton.classList.toggle(
      "hidden",
      currentMemberIndex === memberCards.length - 1
    );
    if (memberCards.length <= 1) {
      // Hide both if only one member
      prevMemberButton.classList.add("hidden");
      nextMemberButton.classList.add("hidden");
    }
  };

  // Helper to update member content without animation
  // Parameter 'role' dan 'bio' diganti namanya menjadi 'motivasiText' dan 'igLink',
  // disesuaikan dengan apa yang akan kita pakai.
  const updateMemberContent = (img, name, motivasiText) => {
    // Tampilkan Foto
    if (overlayMemberPhoto) {
      overlayMemberPhoto.src = img;
      overlayMemberPhoto.style.display = "block"; // Pastikan tampil
    }

    // Tampilkan Nama
    overlayMemberName.textContent = name;

    // Tampilkan 'data-member-bio' (sebagai motivasi) menggunakan overlayMemberBio
    if (overlayMemberBio) {
      overlayMemberBio.textContent = motivasiText;
      overlayMemberBio.style.display = "block"; // Pastikan tampil
    }

    // Sembunyikan 'Origin' (role) jika elemennya ada di HTML
    if (overlayMemberOrigin) {
      overlayMemberOrigin.textContent = "";
      overlayMemberOrigin.style.display = "none";
    }

    // Sembunyikan 'Instagram' jika elemennya ada di HTML
    if (overlayMemberInstagram) {
      overlayMemberInstagram.textContent = "";
      overlayMemberInstagram.href = "#";
      overlayMemberInstagram.style.display = "none";
    }
  };

  // Event listeners for member cards to open overlay
  memberCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      showMember(index); // Show the clicked member
      openOverlay(memberOverlay); // Open the overlay
    });
  });

  // Event listeners for member navigation buttons
  if (prevMemberButton) {
    prevMemberButton.addEventListener("click", () =>
      showMember(currentMemberIndex - 1, "prev")
    );
  }
  if (nextMemberButton) {
    nextMemberButton.addEventListener("click", () =>
      showMember(currentMemberIndex + 1, "next")
    );
  }

  // Close member overlay
  if (closeMemberOverlay) {
    closeMemberOverlay.addEventListener("click", () =>
      closeOverlay(memberOverlay)
    );
  }
  if (memberOverlay) {
    memberOverlay.addEventListener("click", (event) => {
      if (event.target === memberOverlay) closeOverlay(memberOverlay);
    });
  }

  // --- NEW: Moment Detail Overlay Logic --- (Tidak ada perubahan di sini)

  // Function to populate and show a specific moment
  const showMoment = (index, direction = "none") => {
    if (index < 0 || index >= momentItems.length) return; // Boundary check

    const currentItem = momentItems[index];
    const momentImage = currentItem.querySelector("img")?.src || "";
    const momentCaption =
      currentItem.querySelector(".moment-caption")?.textContent ||
      "No caption available.";

    // Apply slide-out animation to current content
    if (direction !== "none") {
      momentImageContent.classList.add(
        direction === "next" ? "slide-out-left" : "slide-out-right"
      );
      momentImageContent.addEventListener("animationend", function handler() {
        momentImageContent.classList.remove(
          "slide-out-left",
          "slide-out-right"
        );
        updateMomentContent(momentImage, momentCaption);
        momentImageContent.classList.add(
          direction === "next" ? "slide-in-right" : "slide-in-left"
        );
        momentImageContent.addEventListener(
          "animationend",
          function handler2() {
            momentImageContent.classList.remove(
              "slide-in-right",
              "slide-in-left"
            );
            momentImageContent.removeEventListener("animationend", handler2);
          }
        );
        this.removeEventListener("animationend", handler);
      });
    } else {
      updateMomentContent(momentImage, momentCaption);
    }

    currentMomentIndex = index;
    momentSlideIndicator.textContent = `${currentMomentIndex + 1}/${
      momentItems.length
    }`;

    // Show/hide navigation buttons if at start/end
    prevMomentButton.classList.toggle("hidden", currentMomentIndex === 0);
    nextMomentButton.classList.toggle(
      "hidden",
      currentMomentIndex === momentItems.length - 1
    );
    if (momentItems.length <= 1) {
      // Hide both if only one moment
      prevMomentButton.classList.add("hidden");
      nextMomentButton.classList.add("hidden");
    }
  };

  // Helper to update moment content without animation
  const updateMomentContent = (img, caption) => {
    overlayMomentImage.src = img;
  };

  // Event listeners for moment items to open overlay
  momentItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      showMoment(index); // Show the clicked moment
      openOverlay(momentOverlay); // Open the overlay
    });
  });

  // Event listeners for moment navigation buttons
  if (prevMomentButton) {
    prevMomentButton.addEventListener("click", () =>
      showMoment(currentMomentIndex - 1, "prev")
    );
  }
  if (nextMomentButton) {
    nextMomentButton.addEventListener("click", () =>
      showMoment(currentMomentIndex + 1, "next")
    );
  }

  // Close moment overlay
  if (closeMomentOverlay) {
    closeMomentOverlay.addEventListener("click", () =>
      closeOverlay(momentOverlay)
    );
  }
  if (momentOverlay) {
    momentOverlay.addEventListener("click", (event) => {
      if (event.target === momentOverlay) closeOverlay(momentOverlay);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("searchInput");
  const resultsContainer = document.createElement("ul");
  resultsContainer.id = "searchResults";
  resultsContainer.style.position = "absolute";
  resultsContainer.style.backgroundColor = "#fff";
  resultsContainer.style.listStyle = "none";
  resultsContainer.style.padding = "0";
  resultsContainer.style.margin = "0";
  resultsContainer.style.border = "1px solid #ccc";
  resultsContainer.style.width = input.offsetWidth + "px";
  resultsContainer.style.zIndex = "999";
  resultsContainer.style.maxHeight = "200px";
  resultsContainer.style.overflowY = "auto";

  input.parentNode.appendChild(resultsContainer);

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    resultsContainer.innerHTML = "";
    if (!query) return;

    const allCards = document.querySelectorAll(".col-md-3.mb-3");

    allCards.forEach((card) => {
      const titleEl = card.querySelector("h5.card-title");
      if (!titleEl) return;

      const title = titleEl.textContent.trim().toLowerCase();
      if (title.includes(query)) {
        const li = document.createElement("li");
        li.textContent = titleEl.textContent.trim();
        if (card.id.startsWith("member-")) {
          li.textContent += " (Member)";
        } else if (card.id.startsWith("moment-")) {
          li.textContent += " (Moment)";
        }

        li.style.padding = "8px";
        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          input.value = "";
          resultsContainer.innerHTML = "";
          closeOverlay(searchOverlay); // ← Tambahan ini
        });

        resultsContainer.appendChild(li);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!resultsContainer.contains(e.target) && e.target !== input) {
      resultsContainer.innerHTML = "";
    }
  });
});

// 🔍 SEARCH FUNCTION UNTUK MEMBER & MOMENT
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  const memberCards = document.querySelectorAll(".member-card");
  const momentItems = document.querySelectorAll(".moment-item");

  const allItems = [...memberCards, ...momentItems];

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    searchResults.innerHTML = "";

    if (!searchTerm) {
      searchResults.style.display = "none";
      return;
    }

    const matches = allItems.filter((item) =>
      item.textContent.toLowerCase().includes(searchTerm)
    );

    if (matches.length === 0) {
      searchResults.style.display = "none";
      return;
    }

    matches.forEach((match) => {
      const item = document.createElement("div");
      item.className = "result-item";
      item.textContent = match.textContent;

      item.addEventListener("click", function () {
        match.scrollIntoView({ behavior: "smooth", block: "center" });
        searchResults.style.display = "none";
        searchInput.value = "";

        const searchOverlay = document.getElementById("searchOverlay");
        if (searchOverlay) {
          searchOverlay.classList.remove("active");
          document.body.style.overflow = "";
        }
      });

      searchResults.appendChild(item);
    });

    searchResults.style.display = "block";
  });

  document.addEventListener("click", function (e) {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
      searchResults.style.display = "none";
    }
  });
});
