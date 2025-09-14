document.addEventListener("DOMContentLoaded", () => {
  const iconSearch = document.getElementById("icon-search");
  const iconsContainer = document.querySelector(".icons-display .container");
  const iconPopup = document.getElementById("icon-popup");
  const closeButton = iconPopup.querySelector(".close-button");
  const popupIconDisplay = document.getElementById("popup-icon-display");
  const popupIconName = document.getElementById("popup-icon-name");
  const popupCodeClass = document.getElementById("popup-code-class");
  const popupCodeUnicode = document.getElementById("popup-code-unicode");

  let iconsData = [];

  // Function to fetch and parse the CSS file
  const fetchIcons = async () => {
    try {
      const response = await fetch("./cssFiles/luxoraIcons.css");
      const cssText = await response.text();
      parseIconsFromCSS(cssText);
    } catch (error) {
      console.error("Error fetching or parsing icons:", error);
      iconsContainer.innerHTML = "<p>Could not load icons. Please ensure 'luxora-icons.css' is in the correct directory.</p>";
    }
  };

  // Function to parse the CSS for icon classes and unicode
  const parseIconsFromCSS = (css) => {
    const iconRegex = /\.lu-([a-zA-Z0-9-]+-icon):before \{[\s\n]*content: "([^"]+)"/g;
    let match;
    const categories = new Map();

    while ((match = iconRegex.exec(css)) !== null) {
      const className = `lu-${match[1]}`;
      const iconName = className.replace(/lu-|-svgrepo-com|-icon|/g, "").replace(/-/g, " ").trim();
      const unicode = match[2];

      
      let category = "Misc";
      if (iconName.includes("arrow")) {
        category = "Arrows & Navigation";
      } else if (iconName.includes("file") || iconName.includes("folder") || iconName.includes("copy") || iconName.includes("paste") || iconName.includes("drive")) {
        category = "Files & Folders";
      } else if (iconName.includes("tool") || iconName.includes("wrench") || iconName.includes("hammer") || iconName.includes("cog")) {
        category = "Tools & Settings";
      } else if (iconName.includes("home") || iconName.includes("office")) {
        category = "Home & Office";
      } else if (iconName.includes("cloud") || iconName.includes("download") || iconName.includes("upload")) {
        category = "Cloud & Download";
      } else if (iconName.includes("camera") || iconName.includes("image") || iconName.includes("video") || iconName.includes("photo")) {
        category = "Media";
      } else if (iconName.includes("user")) {
        category = "Users & People";
      } else if (iconName.includes("cart") || iconName.includes("price") || iconName.includes("dollar")) {
        category = "E-commerce & Payments";
      } else if (iconName.includes("social") || iconName.includes("twitter") || iconName.includes("facebook") || iconName.includes("youtube") || iconName.includes("linkedin") || iconName.includes("github")) {
        category = "Social & Brands";
      }
      
      const iconData = {
        name: iconName,
        className: className,
        unicode: unicode,
        category: category,
      };
      
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push(iconData);
      iconsData.push(iconData);
    }
    
    displayIcons(iconsData, categories);
  };
  
  const displayIcons = (filteredIcons, categories) => {
    
    if (filteredIcons.length > 0) {
      const iconFragment = document.createDocumentFragment();

      const sortedCategories = Array.from(categories.keys()).sort();
      
      sortedCategories.forEach(category => {
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("category-section");
        
        const categoryTitle = document.createElement("h3");
        categoryTitle.textContent = category;
        categoryElement.appendChild(categoryTitle);
        
        const categoryGrid = document.createElement("div");
        categoryGrid.classList.add("icons-grid");
        
        const iconsInCategory = categories.get(category);
        iconsInCategory.forEach(icon => {
          categoryGrid.appendChild(createIconElement(icon));
        });
        
        categoryElement.appendChild(categoryGrid);
        iconFragment.appendChild(categoryElement);
      });
      
      iconsContainer.innerHTML = "";
      iconsContainer.appendChild(iconFragment);

      iconsContainer.addEventListener("click", handleIconClick);
    } else {
      iconsContainer.innerHTML = "<p>No icons found matching your search.</p>";
    }
  };

  const createIconElement = (icon) => {
    const iconItem = document.createElement("div");
    iconItem.classList.add("icon-item");
    iconItem.dataset.className = icon.className;
    iconItem.dataset.unicode = icon.unicode;
    iconItem.dataset.name = icon.name;
    
    const iElement = document.createElement("i");
    iElement.classList.add("luxora-icon", icon.className);
    
    const spanElement = document.createElement("span");
    spanElement.textContent = icon.name;
    
    iconItem.appendChild(iElement);
    iconItem.appendChild(spanElement);
    return iconItem;
  };
  
  const handleIconClick = (event) => {
    const iconItem = event.target.closest(".icon-item");
    if (iconItem) {
      const className = iconItem.dataset.className;
      const unicode = iconItem.dataset.unicode;
      const name = iconItem.dataset.name;
      
      popupIconDisplay.className = `luxora-icon ${className}`;
      popupIconName.textContent = name;
      popupCodeClass.textContent = className;
      popupCodeUnicode.textContent = unicode;
      
      iconPopup.style.display = "flex";
    }
  };
  
  closeButton.addEventListener("click", () => {
    iconPopup.style.display = "none";
  });
  
  window.addEventListener("click", (event) => {
    if (event.target === iconPopup) {
      iconPopup.style.display = "none";
    }
  });
  
  iconSearch.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredIcons = iconsData.filter((icon) => {
      return icon.name.toLowerCase().includes(searchTerm) || icon.className.toLowerCase().includes(searchTerm);
    });
    
    const filteredCategories = new Map();
    filteredIcons.forEach(icon => {
      const { category } = icon;
      if (!filteredCategories.has(category)) {
        filteredCategories.set(category, []);
      }
      filteredCategories.get(category).push(icon);
    });

    displayIcons(filteredIcons, filteredCategories);
  });
  
document.querySelectorAll(".copy-button").forEach(button => {
    button.addEventListener("click", (event) => {
        const codeBlock = event.target.closest('.code-example').querySelector("code");
        const textToCopy = codeBlock.innerText;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = button.textContent;
            button.textContent = "Copied!";
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    });
});
  
  fetchIcons();
});


// Extra JS for Elements

// On Load
window.addEventListener("load", function() {
    const btn = document.querySelector("#secondParaOfHero button");
    if (btn) {
      btn.classList.add("animate");
    }
  });


// custom Alert
function customAlert() {
  const alertPopup = document.getElementById("alertPopup");

  if (!alertPopup) return;

  alertPopup.style.display = "block"; 
  alertPopup.style.opacity= "1"; 
  
  setTimeout(() => {
    alertPopup.style.opacity = "0";
    alertPopup.style.display = "none";
  }, 3000);
}



const Header = document.querySelector('.headerMain');

window.addEventListener("scroll", ()=> {
  if (window.scrollY > 420 ) {
  Header.style.background = 'transparent'
  document.getElementById('bottom-lineHeader').style.opacity = 1;
} else {
  Header.style.background = '#fff'
  document.getElementById('bottom-lineHeader').style.opacity = 0;
  }
})

// for Modal Popups
 window.onclick = function(event) {
      const LicenceModal = document.getElementById('licensePopup');
      const AboutModal = document.getElementById('aboutPopup');
      const ContactModal = document.getElementById('contactPopup');
      const supportPopup = document.getElementById('supportPopup');
      if (event.target === LicenceModal) {
        LicenceModal.style.opacity = "0";
        setTimeout(() => {
          LicenceModal.style.display = "none";
        }, 800);
      }
      if (event.target === AboutModal) {
        AboutModal.style.opacity = "0";
        setTimeout(() => {
          AboutModal.style.display = "none";
        }, 800);
      }
      if (event.target === ContactModal) {
        ContactModal.style.opacity = "0";
        setTimeout(() => {
          ContactModal.style.display = "none";
        }, 800);
      }
      if (event.target === cdnShowMain_Container) {
        cdnShowMain_Container.style.opacity = "0";
        setTimeout(() => {
          cdnShowMain_Container.style.display = "none";
        }, 800);
      }
      if (event.target === supportPopup) {
        supportPopup.style.opacity = "0";
        setTimeout(() => {
          supportPopup.style.display = "none";
        }, 800);
      }
    }


    // Go To Top Button
    const goToTopBtn = document.getElementById("goToTopBtn");
    window.addEventListener("scroll", () => {
      if ( window.scrollY > innerHeight ) {
        goToTopBtn.style.display = "flex";
        setTimeout(() => {
          goToTopBtn.style.opacity = "1";
        }, 300);
      } else {
      goToTopBtn.style.opacity = "0";
      setTimeout(() => {
        goToTopBtn.style.display = "none";
      }, 300);
    }
    });

  goToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

// JS
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  document.querySelectorAll('.icons-grid').classList.toggle("dark");
}


// CDN Show

const cdnOpen_Btn = document.getElementById('cdnOpenBtn');
const cdnShowMain_Container = document.querySelector('.cdnPopup-modal');
const cdnURL = "https://cdn.jsdelivr.net/gh/Yashh-Penchi/Luxora-icons/cssFiles/luxoraIcons.css"
const cdnShowContainer = document.querySelector('#cdnLinkContainer #cdnURL');
const cdnCopyBtn = document.getElementById('cdnCopyBtn');

// Show cdn url in Container
cdnShowContainer.innerText = cdnURL;

// Copy Button Functionality
cdnCopyBtn.addEventListener("click", ()=> {
  const copyArea = document.querySelector('#cdnLinkContainer code');
  const copyText = copyArea.innerText;

  navigator.clipboard.writeText(copyText).then(() => {
    cdnCopyBtn.innerHTML = "✅ Copied!";
    cdnCopyBtn.style.padding = "8rem 0.5rem";
    setTimeout(() => {
      cdnCopyBtn.style.padding = "8rem 1.2rem";
      cdnCopyBtn.innerHTML = '<i class="lu-copy-icon"></i>';
      cdnCopyBtn.style.background = "#2c3e50"
      }, 2000);
        }).catch(err => {
            console.error("Failed to copy text: ", err);
            alert.error("Failed to copy text: ", err);
        });
})

// JS Form Validation

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Stop default submit (Formspree handle karega agar valid ho)

  let isValid = true;

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  nameError.style.display = "none";
  emailError.style.display = "none";
  messageError.style.display = "none";

  if (name.value.trim() === "") {
    nameError.style.display = "block";
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    emailError.style.display = "block";
    isValid = false;
  }

  if (message.value.trim() === "") {
    messageError.style.display = "block";
    isValid = false;
  }

  if (isValid) {
    this.submit();
  }
});


