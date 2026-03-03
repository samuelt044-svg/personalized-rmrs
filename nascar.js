document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("pitStopModal");
    window.closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.style.display = "none", 300);
    };

    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightboxImg");

    document.querySelectorAll(".gallery img").forEach(img => {
        img.onclick = () => {
            lb.style.display = "flex";
            lbImg.src = img.src;
        };
    });
    lb.onclick = () => lb.style.display = "none";

    const schedDiv = document.getElementById("schedule-list");
    if (schedDiv) {
        fetch('nascar_data.json')
            .then(res => res.json())
            .then(data => {
                let html = "<table style='width:100%; text-align:left; border-collapse:collapse;'>";
                html += "<tr style='background:#2b2b2b; color:white;'><th>Race</th><th>Track</th><th>Date</th></tr>";
                data.schedule.forEach(item => {
                    html += `<tr style='border-bottom:1px solid #ddd'>
                                <td style='padding:10px;'>${item.race}</td>
                                <td>${item.track}</td>
                                <td>${item.date}</td>
                             </tr>`;
                });
                html += "</table>";
                schedDiv.innerHTML = html;
            });
    }
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const images = document.querySelectorAll('.gallery img');

images.forEach(image => {
    image.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = image.src;
    });
});

lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
});