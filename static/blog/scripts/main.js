// JavaScript 主要功能文件

// DOM 元素获取
const contactBtn = document.getElementById('contactBtn');
const mobileContactBtn = document.getElementById('mobileContactBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const articlesList = document.getElementById('articlesList');
const loadingSpinner = document.getElementById('loadingSpinner');
const noArticles = document.getElementById('noArticles');

// 文章数据配置
const articlesData = {
    programming: [
        {
            title: "优雅的代码设计：SOLID原则在现代软件开发中的应用",
            date: "2025年1月15日",
            file: "articles/programming/solid-principles.html",
            summary: "深入探讨SOLID原则在现代软件开发中的实际应用"
        }
    ],
    reading: [
        {
            title: "读《人类简史》有感",
            date: "2025年1月8日",
            file: "articles/reading/sapiens-thoughts.html",
            summary: "尤瓦尔·赫拉利以独特的视角审视人类历史"
        }
    ],
    essay: [
        {
            title: "深夜代码时光",
            date: "2024年12月28日",
            file: "articles/essay/night-codes.html",
            summary: "那些在深夜里与代码对话的时光"
        }
    ]
};

// 分类映射
const categoryMap = {
    programming: { name: "编程", color: "programming" },
    reading: { name: "读书", color: "reading" },
    essay: { name: "随笔", color: "essay" }
};

// 联系我模态框功能
function openContactModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 移动端菜单功能
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// 文章数据处理
function getAllArticles() {
    let allArticles = [];
    Object.keys(articlesData).forEach(category => {
        articlesData[category].forEach(article => {
            allArticles.push({
                ...article,
                category: category,
                categoryName: categoryMap[category].name,
                categoryColor: categoryMap[category].color
            });
        });
    });
    
    // 按日期排序（最新的在前）
    return allArticles.sort((a, b) => {
        const dateA = new Date(a.date.replace('年', '-').replace('月', '-').replace('日', ''));
        const dateB = new Date(b.date.replace('年', '-').replace('月', '-').replace('日', ''));
        return dateB - dateA;
    });
}

function getArticlesByCategory(category) {
    if (category === 'all') {
        return getAllArticles();
    }
    
    if (articlesData[category]) {
        return articlesData[category].map(article => ({
            ...article,
            category: category,
            categoryName: categoryMap[category].name,
            categoryColor: categoryMap[category].color
        }));
    }
    
    return [];
}

// 创建文章项元素
function createArticleElement(article) {
    const articleEl = document.createElement('article');
    articleEl.className = 'article-item';
    
    articleEl.innerHTML = `
        <span class="category-tag ${article.categoryColor}">${article.categoryName}</span>
        <a href="${article.file}" class="article-title">${article.title}</a>
        <time class="article-time">${article.date}</time>
    `;
    
    // 添加点击事件
    articleEl.addEventListener('click', function(e) {
        if (e.target.tagName !== 'A') {
            window.location.href = article.file;
        }
    });
    
    return articleEl;
}

// 渲染文章列表
function renderArticles(category = 'all') {
    // 显示加载状态
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    if (articlesList) articlesList.style.display = 'none';
    if (noArticles) noArticles.style.display = 'none';
    
    // 模拟加载延迟
    setTimeout(() => {
        const articles = getArticlesByCategory(category);
        
        // 隐藏加载状态
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        
        if (articles.length === 0) {
            // 显示无文章状态
            if (noArticles) noArticles.style.display = 'block';
            if (articlesList) articlesList.style.display = 'none';
        } else {
            // 渲染文章列表
            if (articlesList) {
                articlesList.innerHTML = '';
                articlesList.style.display = 'block';
                
                articles.forEach(article => {
                    const articleEl = createArticleElement(article);
                    articlesList.appendChild(articleEl);
                });
            }
        }
    }, 300);
}

// 分类筛选功能
function initCategoryFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // 更新活跃状态
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 渲染文章列表
            renderArticles(category);
        });
    });
}

// 事件监听器设置
document.addEventListener('DOMContentLoaded', function() {
    // 联系我按钮事件
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openContactModal();
        });
    }
    
    if (mobileContactBtn) {
        mobileContactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openContactModal();
            mobileMenu.classList.remove('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    }
    
    // 模态框关闭事件
    if (modalClose) {
        modalClose.addEventListener('click', closeContactModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeContactModal();
            }
        });
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeContactModal();
        }
    });
    
    // 移动端菜单事件
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // 移动端菜单链接事件
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (!this.id || this.id !== 'mobileContactBtn') {
                mobileMenu.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
    
    // 点击外部区域关闭移动端菜单
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target) && 
            mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // 初始化分类筛选和文章加载
    initCategoryFilter();
    renderArticles('all');
});

// 平滑滚动到顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 添加返回顶部按钮
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 48px;
        height: 48px;
        background-color: #141414;
        color: #FFFFFF;
        border: none;
        border-radius: 4px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 200ms ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // 显示/隐藏返回顶部按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    backToTopBtn.addEventListener('click', scrollToTop);
});

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 窗口大小改变时重新计算布局
const handleResize = debounce(function() {
    // 在窗口大小改变时不需要特殊处理，因为CSS已经处理了响应式布局
    console.log('窗口大小已改变，布局已自适应');
}, 250);

window.addEventListener('resize', handleResize);

// 页面加载完成后的初始化
window.addEventListener('load', function() {
    console.log('博客网站加载完成');
    
    // 性能监控
    const loadTime = performance.now();
    console.log(`页面加载耗时: ${Math.round(loadTime)}ms`);
});