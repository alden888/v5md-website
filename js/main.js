// main.js - V5 Medical 核心交互脚本

// 1. 极速加载动画 (Loader)
function hideLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.style.opacity = '0';
        setTimeout(() => { loader.classList.add('hidden'); }, 500);
    }
}
document.addEventListener('DOMContentLoaded', hideLoader);
setTimeout(hideLoader, 2000); // 强制保险

// 2. 移动端菜单切换
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if(mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
}

// 3. 导航栏滚动变色
const navbar = document.getElementById('navbar');
const navTitle = document.getElementById('nav-title');
const navSubtitle = document.getElementById('nav-subtitle');
const navLinks = document.querySelectorAll('.nav-link');

function updateNav() {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
        if(navTitle) {
            navTitle.classList.remove('text-white');
            navTitle.classList.add('text-blue-900');
        }
        if(navSubtitle) {
            navSubtitle.classList.remove('text-blue-100');
            navSubtitle.classList.add('text-gray-600');
        }
        navLinks.forEach(link => {
            link.classList.remove('text-blue-100', 'hover:text-white');
            link.classList.add('text-gray-600', 'hover:text-blue-600');
        });
    } else {
        navbar.classList.remove('nav-scrolled');
        if(navTitle) {
            navTitle.classList.add('text-white');
            navTitle.classList.remove('text-blue-900');
        }
        if(navSubtitle) {
            navSubtitle.classList.add('text-blue-100');
            navSubtitle.classList.remove('text-gray-600');
        }
        navLinks.forEach(link => {
            link.classList.add('text-blue-100', 'hover:text-white');
            link.classList.remove('text-gray-600', 'hover:text-blue-600');
        });
    }
}
window.addEventListener('scroll', updateNav);
window.addEventListener('load', updateNav);

// 4. 返回顶部按钮
const backToTop = document.getElementById('back-to-top');
if(backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 300);
    });
    backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
}

// 5. 谷歌翻译初始化
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ar,es,fr,ru,nl,de,it,pt,ja,ko,tr,pl,vi,hi,id,th,sv,zh-CN,zh-TW',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}
