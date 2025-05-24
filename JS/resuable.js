const hamburgerMenuButton = document.querySelector('.hamburger-menu-button');
const hamburgerMenuImg = document.querySelector('.hamburger-menu-img');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const displayAreaMenu = document.getElementById('displayAreaMenu')

const hamburgerMenuImgSrc = '../PUBLIC/icons/hamburger-menu.png';
const hamburgerMenuClosingImgSrc = '../PUBLIC/icons/close-icon.png'

function isLoggedIn(){
    return localStorage.getItem('accessToken') !== null;
}
function updateView (htmlMenuContent){
    if(!displayAreaMenu) return;
    displayAreaMenu.innerHTML = htmlMenuContent;
}

function updateMenuBasedOnStatus(){
    if(isLoggedIn()){
        updateView(`
            <ul class="toggled-menu">
            <li class="toggled-menu-elements"><a href="../index.html" class="toggled-menu-link">HOME</a></li>
            <li class="toggled-menu-elements"><a href="../HTML/blog-list.html" class="toggled-menu-link">BLOG POSTS</a></li>
            <li class="toggled-menu-elements"><a href="../HTML/contact.html" class="toggled-menu-link">CONTACT</a></li>
            <li class="toggled-menu-elements"><a href="../HTML/about.html" class="toggled-menu-link">ABOUT</a></li>
            <li class="toggled-menu-elements"><a class="toggled-menu-link" id="logOut-Link">LOG OUT</a></li>
            </ul>
            `);
            const logOutLink = displayAreaMenu.querySelector('#logOut-Link');
            if(logOutLink){
                logOutLink.addEventListener('click', event =>{
                    event.preventDefault();
                    localStorage.removeItem('authorazationKey');
                    closeToggleMenu();
            });
        }
} else {
    updateView(`
               <ul class="toggled-menu">
            <li class="toggled-menu-elements"><a href="../index.html" class="toggled-menu-link">HOME</a></li>
            <li class="toggled-menu-elements"><a href="../HTML/blog-list.html" class="toggled-menu-link">BLOG POSTS</a></li>
            <li class="toggled-menu-elements"><a href="../HTML/contact.html" class="toggled-menu-link">CONTACT</a></li>
            <li class="toggled-menu-elements"><a href="../HTML/about.html" class="toggled-menu-link">ABOUT</a></li>
            <li class="toggled-menu-elements"><a href="../HTML/login-page.html" class="toggled-menu-link">LOG IN</a></li>
            <li class="toggled-menu-elements"><a href="../HTML/registeration.html" class="toggled-menu-link">REGISTRATION</a></li>
            </ul>
            `);
    }
}

function openToggleMenu(){
    updateMenuBasedOnStatus();
    displayAreaMenu.classList.add('open');
    hamburgerMenuImg.src = hamburgerMenuClosingImgSrc;
}

function closeToggleMenu(){
    displayAreaMenu.classList.remove('open');
    hamburgerMenuImg.src = hamburgerMenuImgSrc;   
}

hamburgerMenuButton.addEventListener('click', () =>{
    if(displayAreaMenu.classList.contains('open')){
        closeToggleMenu();
    } else {
        openToggleMenu();
    }
});

displayAreaMenu.addEventListener('click', closeToggleMenu);
document.addEventListener('keydown', e =>{
    if(e.key === 'Escape' && displayAreaMenu.classList.contains('open')){
        closeToggleMenu();
    }
});
document.addEventListener('click', e => {
    if (!displayAreaMenu.contains(e.target) && !hamburgerMenuButton.contains(e.target)){
        if(displayAreaMenu.classList.contains('open')){
            closeToggleMenu();
        }
    }
});