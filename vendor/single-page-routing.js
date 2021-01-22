/* One Page Blog Javascript

Defaults to standard page navigation on IE

HTML Sample structure
    <div class="page">
        <nav class="sidebar">
            <a href="/">Home</a>
            <a href="/about/">About</a>
            <a href="/contact/">Contact</a>
        </nav>
        <div id="root" class="content">
        </div>
    </div>
*/

/* Options */
//rootSelector => the container for the content (must be the same across all pages - all pages must have a element with the 'root' selector.)
//linkElementSelector => page changing buttons (e.g. <a href="/about/">About</a>)
//rootTransitionDuration => sync with the duration length of the transition set on the root (rootSelector)
rootSelector = 'root';
linkElementSelector = '.sidebar a';
rootTransitionDuration = 300;

root = document.getElementById(rootSelector);
currentURL = window.location.pathname;

async function displayPage(url) {
    //Get URL and convert to page text stream
    let response = await fetch(url)
        .then((response) => response.text())
        .then((htmlString) => {
            //Convert page text stream to a DOM object
            var parser = new DOMParser();
            var doc = parser.parseFromString(htmlString, 'text/html');
            newRootContent = doc.getElementById(rootSelector).innerHTML;
            //Play root animation
            root.style.opacity = 0;
            window.setTimeout(function () {
                root.innerHTML = newRootContent;
                root.style.opacity = 1;
            }, rootTransitionDuration);
            //Update URL bar
            pageTitle = doc.title;
            history.pushState({ id: pageTitle }, pageTitle, url);
        });
}

//On page load, apply click event to buttons
menuItems = document.querySelectorAll(linkElementSelector);
menuItems.forEach((menuItem) => {
    //Set the URL for the link, then destroy it so there is no change
    let url = menuItem.getAttribute("href");
    menuItem.removeAttribute("href");
    //If is current page, set button class to active
    if (currentURL == url) {
        menuItem.classList.add('active');
    }
    //When button is clicked, remove active status from other buttons and add active to this one
    menuItem.addEventListener("click", function () {
        document.querySelector(linkElementSelector + '.active').classList.remove('active');
        this.classList.add('active');
        displayPage(url);
    });
});