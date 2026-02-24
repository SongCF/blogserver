/**
 * Markdown to PDF Converter - Core Application Logic
 */

// ===== Sample Content =====
const sampleContent = `# Markdown转PDF工具使用指南

## 欢迎使用纯前端Markdown转PDF工具

这是一个功能完整的Markdown编辑器，支持**实时预览**和**一键PDF导出**。

### 主要功能

1. **实时预览** - 右侧面板实时显示渲染结果
2. **PDF导出** - 生成高质量PDF文档
3. **代码高亮** - 支持多种编程语言
4. **本地化存储** - 所有依赖本地加载，无需网络
5. **响应式设计** - 适配各种屏幕尺寸

### Markdown语法示例

#### 文本格式化
- **粗体文本** 使用 **粗体**
- *斜体文本* 使用 *斜体*
- ~~删除线~~ 使用 ~~删除线~~
- 
#### 列表
1. 有序列表项1
2. 有序列表项2
   - 嵌套无序列表
   - 另一个嵌套项

#### 代码块
\`\`\`javascript
// JavaScript示例
function calculateSum(a, b) {
    return a + b;
}

console.log(calculateSum(5, 3)); // 输出: 8
\`\`\`

\`\`\`python
# Python示例
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
\`\`\`

#### 引用
> 这是引用文本。引用可以包含多行内容。
> 这是引用的第二行。

### PDF选项
- 页面尺寸：A4
- 方向：纵向
- 边距：适中
- 字体：标准易读

---
*点击右上角"生成PDF"按钮开始导出*`;

// ===== DOM Elements =====
const markdownInput = document.getElementById('markdownInput');
const pdfPreview = document.getElementById('pdfPreview');
const charCount = document.getElementById('charCount');
const lineCount = document.getElementById('lineCount');
const downloadPdfBtn = document.getElementById('downloadPdf');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeHelp = document.getElementById('closeHelp');

// ===== Initialize Marked.js =====
function initMarked() {
    // Configure marked options
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
        sanitize: false,
        smartLists: true,
        smartypants: true,
        xhtml: false,
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (e) {
                    console.warn('Highlight error:', e);
                }
            }
            return hljs.highlightAuto(code).value;
        }
    });
}

// ===== Update Preview =====
function updatePreview() {
    const markdown = markdownInput.value;
    
    // Process PDF page break markers before marked parsing
    let processedMarkdown = markdown;
    processedMarkdown = processedMarkdown.replace(/\[pdf-page-break\]/g, '\n<div class="pdf-page-break"></div>\n');
    processedMarkdown = processedMarkdown.replace(/\*\*\*pdf\*\*\*/g, '\n<div class="pdf-page-break"></div>\n');
    
    const html = marked.parse(processedMarkdown);
    pdfPreview.innerHTML = html;
    
    // Apply syntax highlighting to code blocks
    pdfPreview.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
    
    // Update statistics
    updateStats();
}

// ===== Update Statistics =====
function updateStats() {
    const text = markdownInput.value;
    const chars = text.length;
    const lines = text.split('\n').length;
    
    charCount.textContent = `${chars.toLocaleString()} 字符`;
    lineCount.textContent = `${lines.toLocaleString()} 行`;
}

// ===== Generate PDF =====
async function generatePDF() {
    const btn = downloadPdfBtn;
    const originalText = btn.innerHTML;
    
    try {
        // Show loading state
        btn.disabled = true;
        btn.classList.add('loading');
        
        // Wait for rendering to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Generate PDF with optimized page layout
        const element = pdfPreview;
        
        // Create a temporary clone of the element for PDF generation
        const pdfElement = element.cloneNode(true);
        
        // Remove all PDF page break marker visual elements
        const pageBreaks = pdfElement.querySelectorAll('.pdf-page-break');
        pageBreaks.forEach(breakElement => {
            // Set minimal styles for page break
            breakElement.style.cssText = `
                page-break-before: always !important;
                page-break-inside: avoid !important;
                height: 0 !important;
                overflow: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
                clear: both !important;
                border: none !important;
                position: static !important;
                line-height: 0 !important;
                font-size: 0 !important;
            `;
            
            // Remove any child elements
            while (breakElement.firstChild) {
                breakElement.removeChild(breakElement.firstChild);
            }
        });
        
        // No need to remove margins - using CSS for proper spacing now
        
        // Configure PDF options with proper margins
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `markdown-document-${new Date().toISOString().slice(0, 10)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                scrollX: 0,
                scrollY: 0,
                windowWidth: document.documentElement.clientWidth,
                windowHeight: document.documentElement.clientHeight
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            // Add page break options
            pagebreak: {
                mode: ['css'],
                before: '.pdf-page-break'
            }
        };
        
        // Generate PDF from the cleaned element
        await html2pdf().set(opt).from(pdfElement).save();
        
        // Show success feedback
        showNotification('PDF 生成成功！', 'success');
        
    } catch (error) {
        console.error('PDF generation error:', error);
        showNotification('PDF 生成失败: ' + error.message, 'error');
    } finally {
        // Restore button state
        btn.disabled = false;
        btn.classList.remove('loading');
    }
}

// ===== Clear Editor =====
function clearEditor() {
    if (markdownInput.value.trim() === '') return;
    
    if (confirm('确定要清空编辑器内容吗？此操作不可撤销。')) {
        markdownInput.value = '';
        updatePreview();
        markdownInput.focus();
    }
}

// ===== Load Sample =====
function loadSample() {
    markdownInput.value = sampleContent;
    updatePreview();
    showNotification('示例内容已加载', 'success');
}

// ===== Modal Functions =====
function openModal() {
    helpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    helpModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Notification =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#4f46e5'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    
    // Add animation styles
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.25rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .notification-close:hover { opacity: 1; }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// ===== Keyboard Shortcuts =====
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + S - Save/Export PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        generatePDF();
    }
    
    // Escape - Close modal
    if (e.key === 'Escape' && helpModal.classList.contains('active')) {
        closeModal();
    }
}

// ===== Event Listeners =====
function initEventListeners() {
    // Input events
    markdownInput.addEventListener('input', updatePreview);
    markdownInput.addEventListener('scroll', syncScroll);
    
    // Button events
    downloadPdfBtn.addEventListener('click', generatePDF);
    clearBtn.addEventListener('click', clearEditor);
    sampleBtn.addEventListener('click', loadSample);
    helpBtn.addEventListener('click', openModal);
    closeHelp.addEventListener('click', closeModal);
    
    // Modal events
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) closeModal();
    });
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Tab key support in textarea
    markdownInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = markdownInput.selectionStart;
            const end = markdownInput.selectionEnd;
            markdownInput.value = markdownInput.value.substring(0, start) + '    ' + 
                                  markdownInput.value.substring(end);
            markdownInput.selectionStart = markdownInput.selectionEnd = start + 4;
            updatePreview();
        }
    });
}

// ===== Scroll Sync (optional feature) =====
function syncScroll() {
    // Could implement bidirectional scroll sync here
    // For now, we let each panel scroll independently
}

// ===== Initialization =====
function init() {
    // Initialize marked.js
    initMarked();
    
    // Initialize highlight.js
    hljs.highlightAll();
    
    // Setup event listeners
    initEventListeners();
    
    // Initial render
    updatePreview();
    
    // Focus editor
    markdownInput.focus();
    
    console.log('Markdown to PDF Converter initialized successfully!');
}

// ===== Auto-save to localStorage (optional) =====
function setupAutoSave() {
    // Load saved content
    const saved = localStorage.getItem('md2pdf-content');
    if (saved) {
        markdownInput.value = saved;
        updatePreview();
    }
    
    // Save on input (debounced)
    let timeout;
    markdownInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            localStorage.setItem('md2pdf-content', markdownInput.value);
        }, 1000);
    });
}

// ===== Start Application =====
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupAutoSave();
});

// ===== Export for testing (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updatePreview, generatePDF };
}
