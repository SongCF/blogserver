// 文章详情页JavaScript文件 - 简化版

// 文章阅读进度
function initReadingProgress() {
    const article = document.querySelector('.article-content');
    if (!article) return;
    
    // 创建阅读进度条
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background-color: #141414;
        z-index: 999;
        transition: width 100ms ease;
    `;
    document.body.appendChild(progressBar);
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        const articleTop = article.offsetTop; // 没有导航栏，直接从顶部开始
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        const progress = Math.min(
            Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
            1
        );
        
        progressBar.style.width = (progress * 100) + '%';
    });
}

// 代码块复制功能
function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制';
        copyBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 4px 8px;
            background-color: #141414;
            color: #FFFFFF;
            border: none;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 200ms ease;
        `;
        
        block.style.position = 'relative';
        block.appendChild(copyBtn);
        
        block.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });
        
        block.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0';
        });
        
        copyBtn.addEventListener('click', () => {
            const code = block.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '已复制';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        });
    });
}

// 目录生成功能
function generateTableOfContents() {
    const headings = document.querySelectorAll('.article-body h2, .article-body h3');
    if (headings.length < 3) return; // 如果标题太少，不显示目录
    
    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = `
        <h3 style="font-size: 18px; font-weight: 600; color: #141414; margin-bottom: 16px;">目录</h3>
        <nav style="font-size: 14px; line-height: 1.6;">
        </nav>
    `;
    
    const nav = toc.querySelector('nav');
    
    headings.forEach((heading, index) => {
        const id = 'heading-' + index;
        heading.id = id;
        
        const link = document.createElement('a');
        link.href = '#' + id;
        link.textContent = heading.textContent;
        link.style.cssText = `
            display: block;
            color: #495057;
            text-decoration: none;
            padding: 4px 0;
            border-left: 2px solid transparent;
            padding-left: 12px;
            margin-left: ${heading.tagName === 'H3' ? '16px' : '0'};
            transition: all 200ms ease;
        `;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById(id).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
        
        nav.appendChild(link);
    });
    
    // 将目录插入到文章头部
    const articleHeader = document.querySelector('.article-header');
    if (articleHeader) {
        articleHeader.appendChild(toc);
    }
}

// 高亮当前目录项
function highlightCurrentTocItem() {
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    const headings = document.querySelectorAll('.article-body h2, .article-body h3');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100) {
                current = heading.id;
            }
        });
        
        tocLinks.forEach(link => {
            link.style.color = '#495057';
            link.style.borderLeftColor = 'transparent';
            
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = '#141414';
                link.style.borderLeftColor = '#141414';
            }
        });
    });
}

// 分享功能
function initShareButtons() {
    const shareContainer = document.createElement('div');
    shareContainer.className = 'share-buttons';
    
    const article = document.querySelector('.article-title');
    const url = window.location.href;
    const title = article ? article.textContent : '博客文章';
    
    const shareButtons = [
        {
            name: '复制链接',
            icon: '🔗',
            action: () => {
                navigator.clipboard.writeText(url).then(() => {
                    alert('链接已复制到剪贴板');
                });
            }
        },
        {
            name: '分享到微博',
            icon: '🐦',
            action: () => {
                const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                window.open(weiboUrl, '_blank');
            }
        },
        {
            name: '分享到QQ',
            icon: '🐧',
            action: () => {
                const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                window.open(qqUrl, '_blank');
            }
        }
    ];
    
    shareButtons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'share-btn';
        button.innerHTML = `${btn.icon} ${btn.name}`;
        button.addEventListener('click', btn.action);
        shareContainer.appendChild(button);
    });
    
    // 插入到文章内容后
    const articleBody = document.querySelector('.article-body');
    if (articleBody) {
        articleBody.appendChild(shareContainer);
    }
}

// 事件监听器设置
document.addEventListener('DOMContentLoaded', function() {
    // 初始化各种功能
    initReadingProgress();
    initCodeCopy();
    generateTableOfContents();
    highlightCurrentTocItem();
    initShareButtons();
});

// 页面性能监控
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`文章页面加载完成，耗时: ${Math.round(loadTime)}ms`);
    
    // 统计文章阅读时间
    let startTime = Date.now();
    let timeOnPage = 0;
    
    function updateTimeOnPage() {
        timeOnPage = Math.round((Date.now() - startTime) / 1000);
        console.log(`已在页面停留 ${timeOnPage} 秒`);
    }
    
    // 每30秒更新一次
    setInterval(updateTimeOnPage, 30000);
});