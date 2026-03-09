document.addEventListener("DOMContentLoaded", () => {
    // --- 1. PIT STOP MODAL ---
    const modal = document.getElementById("pitStopModal");
    if (modal) {
        if (localStorage.getItem('pitStopCleared') === 'true') {
            modal.style.display = 'none';
        }
        window.closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = "none";
                localStorage.setItem('pitStopCleared', 'true');
            }, 300);
        };
    }

    // --- 2. LIGHTBOX ---
    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightboxImg");
    const galleryImages = document.querySelectorAll(".driver-card img, .gallery img");

    if (lb && lbImg && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.onclick = () => {
                lb.style.display = "flex";
                lbImg.src = img.src;
            };
        });
        lb.onclick = () => lb.style.display = "none";
    }

    // --- 3. DYNAMIC DATA (SCHEDULE & STANDINGS) ---
    const standingsDiv = document.getElementById("standings-output");
    const schedDiv = document.getElementById("schedule-list");

    if (standingsDiv || schedDiv) {
        fetch('nascar_data.json')
            .then(res => res.json())
            .then(data => {
                
                // A. BUILD STANDINGS TABLE
                if (standingsDiv && data.standings) {
                    let sHtml = `<table>
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Driver</th>
                                <th>Team</th>
                                <th>Wins</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>`;

                    data.standings.forEach(driver => {
                        const rowClass = driver.pos === 16 ? "cutoff-row" : "";
                        // Add trophy to winners
                        const nameDisplay = driver.wins > 0 ? `🏆 ${driver.name}` : driver.name;

                        sHtml += `<tr class="${rowClass}">
                            <td>${driver.pos}</td>
                            <td><strong>${nameDisplay}</strong></td>
                            <td>${driver.team}</td>
                            <td>${driver.wins}</td>
                            <td>${driver.points}</td>
                        </tr>`;
                    });

                    sHtml += "</tbody></table>";
                    standingsDiv.innerHTML = sHtml;
                }

                // B. BUILD SCHEDULE TABLE
                if (schedDiv && data.schedule) {
                    let schHtml = "<table class='schedule-table'><thead><tr><th>Race</th><th>Track</th><th>Date</th><th>Winner</th></tr></thead><tbody>";
                    data.schedule.forEach(item => {
                        schHtml += `<tr><td>${item.race}</td><td>${item.track}</td><td>${item.date}</td><td>${item.winner}</td></tr>`;
                    });
                    schHtml += "</tbody></table>";
                    schedDiv.innerHTML = schHtml;
                }

            }).catch(err => {
                console.error("Data load failed:", err);
            });
    }

    // --- THEME TOGGLE ---
    // Create or reuse toggle button (with icon) and append to footer if present
    function createThemeToggle() {
        if (document.getElementById('themeToggle')) return;
        const btn = document.createElement('button');
        btn.id = 'themeToggle';
        const icon = document.createElement('i');
        icon.className = 'fas fa-moon';
        btn.appendChild(icon);
        btn.onclick = () => toggleTheme();

        const footer = document.querySelector('footer');
        if (footer) {
            // insert before social icons div if present
            const social = footer.querySelector('.social');
            if (social) footer.insertBefore(btn, social);
            else footer.appendChild(btn);
        } else {
            // fallback: append to nav
            const nav = document.querySelector('nav');
            if (nav) nav.appendChild(btn);
        }
    }

    createThemeToggle();

    // Initialize theme from localStorage
    const userTheme = localStorage.getItem('theme');
    const root = document.documentElement;
    if (userTheme === 'light') {
        root.classList.add('light-mode');
        const t = document.querySelector('#themeToggle i'); if (t) { t.className = 'fas fa-sun'; }
    }

    window.toggleTheme = function() {
        if (root.classList.contains('light-mode')) {
            root.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            const t = document.querySelector('#themeToggle i'); if (t) { t.className = 'fas fa-moon'; }
        } else {
            root.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            const t = document.querySelector('#themeToggle i'); if (t) { t.className = 'fas fa-sun'; }
        }
    }

});

// --- 4. SEARCH & BACK TO TOP ---
function filterDrivers() {
    const filter = document.getElementById('driverSearch').value.toLowerCase();
    document.querySelectorAll('.driver-card').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(filter) ? "" : "none";
    });
}

const bttButton = document.getElementById("backToTop");
window.onscroll = () => { if(bttButton) bttButton.style.display = (window.scrollY > 300) ? "block" : "none"; };
function topFunction() { window.scrollTo({top: 0, behavior: 'smooth'}); }