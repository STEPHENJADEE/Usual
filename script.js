function openCategory(evt, categoryName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("category-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }

    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    const targetCat = document.getElementById(categoryName);
    targetCat.style.display = "block";
    setTimeout(() => targetCat.classList.add("active"), 10);
    evt.currentTarget.classList.add("active");

    // Reset to page 1 for the selected category
    changePage(categoryName, 1);
}

function changePage(category, pageNum) {
    // Hide all pages in this category
    const pages = document.querySelectorAll(`.${category}-p`);
    pages.forEach(p => p.classList.remove('active'));

    // Show selected page
    const targetPage = document.getElementById(`${category}-p${pageNum}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update the indicator (e.g., "Page 1 of 3")
    const indicator = document.querySelector(`#${category} .page-indicator`);
    if (indicator && pages.length > 0) {
        indicator.innerText = `Page ${pageNum} of ${pages.length}`;
    }

    // Scroll to the start of the menu container for better UX
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
    }
}