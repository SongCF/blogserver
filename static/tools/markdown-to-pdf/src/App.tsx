import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Eye, EyeOff, Download, FileText } from 'lucide-react';

const defaultMarkdown = `# 张三

**前端开发工程师** | zhang.san@email.com | 138-0000-0000

---

## 个人简介

具有5年前端开发经验的工程师，精通React、TypeScript和现代化前端工具链。热爱技术，注重代码质量和用户体验。

---

## 工作经历

### 高级前端工程师 | ABC科技有限公司
*2021年3月 - 至今*

- 主导公司核心产品的前端架构设计和技术选型
- 建立组件库和设计系统，提升团队开发效率30%
- 优化首屏加载性能，将LCP从3.2s降至1.5s

### 前端开发工程师 | XYZ互联网公司
*2019年6月 - 2021年2月*

- 参与电商平台的开发和维护
- 实现复杂的数据可视化功能
- 编写单元测试，测试覆盖率达到85%

---

## 技术技能

- **前端框架**: React, Vue.js, Next.js
- **编程语言**: TypeScript, JavaScript, HTML5, CSS3
- **工具链**: Webpack, Vite, Git, Docker
- **其他**: RESTful API, GraphQL, Node.js

---

## 教育背景

### 计算机科学与技术 | 某某大学
*2015年9月 - 2019年6月* | 本科

---

## 项目经历

### 企业级管理系统
使用React + TypeScript开发的大型后台管理系统，包含用户管理、权限控制、数据分析等模块。

### 移动端电商应用
基于React Native开发的跨平台电商应用，支持iOS和Android双平台。
`;

function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [showPreview, setShowPreview] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const html = marked.parse(markdown, { async: false }) as string;
    setHtmlContent(html);
  }, [markdown]);

  const generatePDF = async () => {
    if (!previewRef.current) return;
    
    setIsGenerating(true);
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('document.pdf');
    } catch (error) {
      console.error('PDF生成失败:', error);
      alert('PDF生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-800">文件转换</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? '隐藏预览' : '显示预览'}
              </button>
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {isGenerating ? '生成中...' : '生成PDF'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Markdown Editor */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Markdown 编辑器</h2>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-[calc(100vh-280px)] p-4 text-sm font-mono text-slate-700 resize-none focus:outline-none"
              placeholder="在此输入Markdown内容..."
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">PDF 预览</h2>
              </div>
              <div className="h-[calc(100vh-280px)] overflow-auto p-6">
                <div
                  ref={previewRef}
                  className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-slate-700 prose-a:text-indigo-600"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
