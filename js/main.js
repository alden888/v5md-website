/*!
 * V5 Medical LTD Core Interaction Script
 * @version 1.2.0
 * @author V5 Medical Development Team
 * @description Core JavaScript functionality for V5 Medical website
 * @license Proprietary
 */

// 使用严格模式
'use strict';

/**
 * V5 Medical 核心交互脚本命名空间
 * 封装所有功能以避免全局作用域污染
 */
const V5Medical = (() => {
    // 配置常量 - 集中管理可配置参数
    const config = {
        loader: {
            timeout: 2000,
            fadeDuration: 500
        },
        navigation: {
            scrollThreshold: 50,
            throttleDelay: 100
        },
        backToTop: {
            scrollThreshold: 300
        },
        googleTranslate: {
            pageLanguage: 'en',
            includedLanguages: 'en,ar,es,fr,ru,nl,de,it,pt,ja,ko,tr,pl,vi,hi,id,th,sv,zh-CN,zh-TW',
            layout: 'SIMPLE',
            autoDisplay: false
        },
        analytics: {
            trackingId: 'G-JE15YSMC2W'
        }
    };

    // 性能监控变量
    const performanceMetrics = {
        domContentLoaded: 0,
        initialLoad: 0,
        totalLoadTime: 0
    };

    /**
     * 工具函数：节流函数 - 优化滚动等高频事件
     * @param {Function} func - 要执行的函数
     * @param {number} limit - 节流时间间隔（毫秒）
     * @returns {Function} 节流后的函数
     */
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    /**
     * 工具函数：安全执行函数 - 包含错误处理
     * @param {Function} func - 要执行的函数
     * @param {string} errorMessage - 错误消息
     * @returns {*} 函数执行结果或undefined
     */
    const safeExecute = (func, errorMessage = 'An error occurred') => {
        try {
            return func();
        } catch (error) {
            console.error(`[V5Medical] ${errorMessage}:`, error);
            return undefined;
        }
    };

    /**
     * 工具函数：延迟执行函数
     * @param {Function} func - 要执行的函数
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {number} 定时器ID
     */
    const delay = (func, delay) => {
        return setTimeout(func, delay);
    };

    /**
     * 1. 极速加载动画 (Loader)
     * 隐藏页面加载动画，支持DOMContentLoaded和超时保险
     */
    const initLoader = () => {
        const loader = document.querySelector('.page-loader');
        if (!loader) return;

        const hideLoader = () => {
            if (loader.classList.contains('hidden')) return;
            
            loader.style.transition = `opacity ${config.loader.fadeDuration}ms ease`;
            loader.style.opacity = '0';
            
            setTimeout(() => {
                loader.classList.add('hidden');
                loader.style.opacity = ''; // 清除内联样式
                loader.style.transition = ''; // 清除内联样式
            }, config.loader.fadeDuration);
        };

        // DOMContentLoaded时隐藏
        document.addEventListener('DOMContentLoaded', () => {
            performanceMetrics.domContentLoaded = performance.now();
            hideLoader();
        });

        // 超时保险
        delay(() => {
            performanceMetrics.initialLoad = performance.now();
            hideLoader();
        }, config.loader.timeout);
    };

    /**
     * 2. 移动端菜单切换
     * 处理移动端菜单的显示和隐藏
     */
    const initMobileMenu = () => {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (!mobileMenuBtn || !mobileMenu) return;

        // 添加无障碍支持
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');

        const toggleMenu = () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenu.classList.toggle('hidden');
            
            // 更新无障碍属性
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded);
            
            // 更新按钮图标
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', isExpanded);
                icon.classList.toggle('fa-times', !isExpanded);
            }
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);

        // 点击菜单外区域关闭菜单
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                if (!mobileMenu.classList.contains('hidden')) {
                    toggleMenu();
                }
            }
        });

        // 按ESC键关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                toggleMenu();
            }
        });
    };

    /**
     * 3. 导航栏滚动效果
     * 处理导航栏在滚动时的样式变化
     */
    const initNavigation = () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const navElements = {
            title: document.getElementById('nav-title'),
            subtitle: document.getElementById('nav-subtitle'),
            links: document.querySelectorAll('.nav-link')
        };

        // 定义滚动时的样式更新函数
        const updateNavigation = throttle(() => {
            const isScrolled = window.scrollY > config.navigation.scrollThreshold;

            // 更新导航栏类
            navbar.classList.toggle('nav-scrolled', isScrolled);

            // 更新标题样式
            if (navElements.title) {
                navElements.title.classList.toggle('text-white', !isScrolled);
                navElements.title.classList.toggle('text-blue-900', isScrolled);
            }

            // 更新副标题样式
            if (navElements.subtitle) {
                navElements.subtitle.classList.toggle('text-blue-100', !isScrolled);
                navElements.subtitle.classList.toggle('text-gray-600', isScrolled);
            }

            // 更新导航链接样式
            navElements.links.forEach(link => {
                if (isScrolled) {
                    link.classList.remove('text-blue-100', 'hover:text-white');
                    link.classList.add('text-gray-600', 'hover:text-blue-600');
                } else {
                    link.classList.add('text-blue-100', 'hover:text-white');
                    link.classList.remove('text-gray-600', 'hover:text-blue-600');
                }
            });
        }, config.navigation.throttleDelay);

        // 初始加载时更新
        updateNavigation();

        // 滚动时更新（带节流）
        window.addEventListener('scroll', updateNavigation);
    };

    /**
     * 4. 返回顶部按钮
     * 处理返回顶部按钮的显示和点击事件
     */
    const initBackToTop = () => {
        const backToTop = document.getElementById('back-to-top');
        if (!backToTop) return;

        // 添加无障碍支持
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.setAttribute('tabindex', '0');

        // 滚动时显示/隐藏按钮
        const updateBackToTop = throttle(() => {
            const shouldShow = window.scrollY > config.backToTop.scrollThreshold;
            backToTop.classList.toggle('show', shouldShow);
            backToTop.setAttribute('aria-hidden', !shouldShow);
        }, config.navigation.throttleDelay);

        // 点击返回顶部
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        // 绑定事件
        backToTop.addEventListener('click', scrollToTop);
        backToTop.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });

        // 初始状态
        updateBackToTop();

        // 滚动时更新
        window.addEventListener('scroll', updateBackToTop);
    };

    /**
     * 5. 谷歌翻译初始化
     * 初始化谷歌翻译功能
     */
    const initGoogleTranslate = () => {
        // 检查谷歌翻译脚本是否已加载
        if (window.google && window.google.translate) {
            initializeTranslateElement();
            return;
        }

        // 如果谷歌翻译脚本尚未加载，等待并重试
        const checkTranslateScript = () => {
            if (window.google && window.google.translate) {
                initializeTranslateElement();
            } else {
                delay(checkTranslateScript, 100);
            }
        };

        const initializeTranslateElement = () => {
            try {
                new google.translate.TranslateElement({
                    pageLanguage: config.googleTranslate.pageLanguage,
                    includedLanguages: config.googleTranslate.includedLanguages,
                    layout: google.translate.TranslateElement.InlineLayout[config.googleTranslate.layout],
                    autoDisplay: config.googleTranslate.autoDisplay,
                    multilanguagePage: true
                }, 'google_translate_element');

                // 优化翻译样式
                setTimeout(() => {
                    const translateElement = document.querySelector('.goog-te-gadget');
                    if (translateElement) {
                        translateElement.style.color = 'inherit';
                        translateElement.style.fontFamily = 'inherit';
                    }
                }, 500);
            } catch (error) {
                console.error('[V5Medical] Google Translate initialization failed:', error);
            }
        };

        checkTranslateScript();
    };

    /**
     * 6. 谷歌分析初始化
     * 初始化谷歌分析跟踪
     */
    const initGoogleAnalytics = () => {
        if (!config.analytics.trackingId) return;

        // 动态加载谷歌分析脚本
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics.trackingId}`;
        script.async = true;
        
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', config.analytics.trackingId);
            
            // 跟踪页面加载性能
            gtag('event', 'page_load_performance', {
                'dom_content_loaded': performanceMetrics.domContentLoaded.toFixed(2),
                'initial_load': performanceMetrics.initialLoad.toFixed(2),
                'total_load_time': performanceMetrics.totalLoadTime.toFixed(2)
            });
        };

        document.head.appendChild(script);
    };

    /**
     * 7. 表单验证和提交处理
     * 处理联系表单的验证和提交
     */
    const initForms = () => {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        // 表单验证
        const validateForm = (e) => {
            e.preventDefault();
            
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    field.setAttribute('aria-invalid', 'true');
                    
                    // 添加错误提示
                    const errorId = `${field.name}-error`;
                    let errorElement = document.getElementById(errorId);
                    if (!errorElement) {
                        errorElement = document.createElement('div');
                        errorElement.id = errorId;
                        errorElement.className = 'text-red-500 text-sm mt-1';
                        errorElement.textContent = 'This field is required';
                        field.parentNode.appendChild(errorElement);
                    }
                } else {
                    field.classList.remove('border-red-500');
                    field.setAttribute('aria-invalid', 'false');
                    
                    // 移除错误提示
                    const errorId = `${field.name}-error`;
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.remove();
                    }
                }
            });

            if (!isValid) return;

            // 表单提交处理
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // 显示加载状态
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

            // 使用Fetch API提交表单
            fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // 提交成功
                    contactForm.reset();
                    showNotification('Message sent successfully!', 'success');
                    
                    // 跟踪表单提交事件
                    if (window.gtag) {
                        gtag('event', 'form_submission', {
                            'form_name': 'contact_form',
                            'status': 'success'
                        });
                    }
                } else {
                    throw new Error('Submission failed');
                }
            })
            .catch(error => {
                showNotification('There was an error sending your message. Please try again.', 'error');
                console.error('[V5Medical] Form submission error:', error);
                
                // 跟踪表单提交失败事件
                if (window.gtag) {
                    gtag('event', 'form_submission', {
                        'form_name': 'contact_form',
                        'status': 'error',
                        'error_message': error.message
                    });
                }
            })
            .finally(() => {
                // 恢复按钮状态
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            });
        };

        // 实时验证
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => {
                if (!field.value.trim() && field.hasAttribute('required')) {
                    field.classList.add('border-red-500');
                    field.setAttribute('aria-invalid', 'true');
                } else {
                    field.classList.remove('border-red-500');
                    field.setAttribute('aria-invalid', 'false');
                }
            });
        });

        // 绑定表单提交事件
        contactForm.addEventListener('submit', validateForm);
    };

    /**
     * 8. 通知系统
     * 显示成功/错误通知
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型 (success/error/info)
     */
    const showNotification = (message, type = 'info') => {
        // 移除现有通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out translate-x-full`;
        
        // 根据类型设置样式
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-500', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-500', 'text-white');
                break;
            case 'info':
                notification.classList.add('bg-blue-500', 'text-white');
                break;
        }

        // 设置通知内容
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} text-xl"></i>
                <span>${message}</span>
                <button class="ml-auto text-white hover:text-gray-200" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(notification);

        // 显示通知
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 10);

        // 自动关闭
        const autoCloseTimer = setTimeout(() => {
            closeNotification(notification);
        }, 5000);

        // 点击关闭按钮
        notification.querySelector('button').addEventListener('click', () => {
            clearTimeout(autoCloseTimer);
            closeNotification(notification);
        });
    };

    /**
     * 辅助函数：关闭通知
     * @param {HTMLElement} notification - 通知元素
     */
    const closeNotification = (notification) => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    };

    /**
     * 9. 图片懒加载
     * 优化图片加载性能
     */
    const initLazyLoading = () => {
        // 检查浏览器是否支持原生懒加载
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else {
            // 回退到自定义懒加载实现
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            script.async = true;
            document.body.appendChild(script);
        }
    };

    /**
     * 10. 平滑滚动
     * 为所有内部链接添加平滑滚动效果
     */
    const initSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // 更新URL而不刷新页面
                    history.pushState(null, null, targetId);
                }
            });
        });
    };

    /**
     * 初始化所有功能
     * 统一的入口点
     */
    const init = () => {
        try {
            // 记录总加载时间
            performanceMetrics.totalLoadTime = performance.now();

            // 初始化各个模块
            safeExecute(initLoader, 'Loader initialization failed');
            safeExecute(initMobileMenu, 'Mobile menu initialization failed');
            safeExecute(initNavigation, 'Navigation initialization failed');
            safeExecute(initBackToTop, 'Back to top initialization failed');
            safeExecute(initGoogleTranslate, 'Google Translate initialization failed');
            safeExecute(initGoogleAnalytics, 'Google Analytics initialization failed');
            safeExecute(initForms, 'Form initialization failed');
            safeExecute(initLazyLoading, 'Lazy loading initialization failed');
            safeExecute(initSmoothScrolling, 'Smooth scrolling initialization failed');

            console.log('[V5Medical] All modules initialized successfully');
            
            // 跟踪初始化完成事件
            if (window.gtag) {
                gtag('event', 'application_initialized', {
                    'modules_initialized': 9,
                    'load_time': performanceMetrics.totalLoadTime.toFixed(2)
                });
            }

        } catch (error) {
            console.error('[V5Medical] Initialization failed:', error);
        }
    };

    // 公共API - 只暴露需要在外部访问的方法
    return {
        init,
        showNotification,
        safeExecute,
        config
    };
})();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    V5Medical.init();
});

// 导出供模块系统使用（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = V5Medical;
