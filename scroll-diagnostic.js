// 滚动条诊断脚本 - 在目标页面的 Console 中粘贴并执行

(function() {
  console.clear();
  console.log('%c=== 滚动诊断开始 ===', 'color: #0070f3; font-size: 16px; font-weight: bold;');
  console.log('');
  
  // 1. 基础信息
  const bodyH = document.body.scrollHeight;
  const winH = window.innerHeight;
  const htmlH = document.documentElement.scrollHeight;
  const htmlClientH = document.documentElement.clientHeight;
  
  console.log('%c📏 页面尺寸信息', 'color: #10b981; font-weight: bold;');
  console.log('body.scrollHeight:', bodyH);
  console.log('window.innerHeight:', winH);
  console.log('html.scrollHeight:', htmlH);
  console.log('html.clientHeight:', htmlClientH);
  console.log('差值 (body - window):', bodyH - winH);
  console.log('');
  
  // 2. 检查滚动条
  console.log('%c🔍 滚动条检测', 'color: #f59e0b; font-weight: bold;');
  const hasVerticalScroll = document.documentElement.scrollHeight > document.documentElement.clientHeight;
  const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
  console.log('垂直滚动条:', hasVerticalScroll ? '✅ 存在' : '❌ 不存在');
  console.log('水平滚动条:', hasHorizontalScroll ? '✅ 存在' : '❌ 不存在');
  console.log('');
  
  // 3. body 样式检查
  console.log('%c🎨 Body 样式', 'color: #8b5cf6; font-weight: bold;');
  const bodyStyle = getComputedStyle(document.body);
  console.log('overflow:', bodyStyle.overflow);
  console.log('overflowY:', bodyStyle.overflowY);
  console.log('height:', bodyStyle.height);
  console.log('min-height:', bodyStyle.minHeight);
  console.log('');
  
  // 4. HTML 样式检查
  console.log('%c🎨 HTML 样式', 'color: #8b5cf6; font-weight: bold;');
  const htmlStyle = getComputedStyle(document.documentElement);
  console.log('overflow:', htmlStyle.overflow);
  console.log('overflowY:', htmlStyle.overflowY);
  console.log('height:', htmlStyle.height);
  console.log('');
  
  // 5. 找出所有可能导致滚动的元素
  console.log('%c📦 可滚动元素分析', 'color: #ec4899; font-weight: bold;');
  const elements = [];
  
  document.querySelectorAll('*').forEach(el => {
    if (el.scrollHeight > el.clientHeight + 2) {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      
      elements.push({
        tag: el.tagName,
        class: (el.className || '').toString().slice(0, 60),
        id: el.id || '',
        scrollH: el.scrollHeight,
        clientH: el.clientHeight,
        diff: el.scrollHeight - el.clientHeight,
        overflowY: style.overflowY,
        position: style.position,
        top: Math.round(rect.top),
        height: Math.round(rect.height),
        // 添加元素引用以便后续检查
        element: el
      });
    }
  });
  
  // 按差值排序
  elements.sort((a, b) => b.diff - a.diff);
  
  if (elements.length === 0) {
    console.log('✅ 没有发现可滚动的元素');
  } else {
    console.log(`⚠️ 发现 ${elements.length} 个元素，scrollHeight > clientHeight`);
    console.log('');
    console.log('%c前 10 个差值最大的元素:', 'color: #ef4444; font-weight: bold;');
    
    // 创建表格数据（不包含 element 引用）
    const tableData = elements.slice(0, 10).map(el => ({
      tag: el.tag,
      class: el.class,
      id: el.id,
      scrollH: el.scrollH,
      clientH: el.clientH,
      diff: el.diff,
      overflowY: el.overflowY,
      position: el.position,
      top: el.top
    }));
    
    console.table(tableData);
    
    // 6. 高亮显示问题元素
    console.log('');
    console.log('%c💡 提示: 使用以下命令检查特定元素', 'color: #06b6d4; font-weight: bold;');
    console.log('window.__scrollElements = 上面找到的元素数组');
    console.log('使用 $0 在 Elements 面板中选中元素后查看');
    
    // 将元素存储到全局变量
    window.__scrollElements = elements;
    
    // 7. 自动高亮前 3 个元素
    console.log('');
    console.log('%c🎯 正在高亮前 3 个问题元素（红色边框）', 'color: #f59e0b; font-weight: bold;');
    elements.slice(0, 3).forEach((el, index) => {
      el.element.style.outline = `3px solid ${index === 0 ? 'red' : index === 1 ? 'orange' : 'yellow'}`;
      el.element.style.outlineOffset = '-3px';
      console.log(`${index + 1}. ${el.tag}.${el.class || '(无class)'} - diff: ${el.diff}px`);
    });
    
    // 8. 提供清除高亮的函数
    window.__clearHighlights = function() {
      elements.forEach(el => {
        el.element.style.outline = '';
        el.element.style.outlineOffset = '';
      });
      console.log('✅ 已清除所有高亮');
    };
    
    console.log('');
    console.log('%c使用 __clearHighlights() 清除高亮', 'color: #06b6d4;');
  }
  
  console.log('');
  console.log('%c=== 诊断完成 ===', 'color: #0070f3; font-size: 16px; font-weight: bold;');
  
  // 9. 返回摘要
  return {
    summary: {
      bodyScrollHeight: bodyH,
      windowInnerHeight: winH,
      overflow: bodyH - winH,
      hasVerticalScroll,
      problematicElementsCount: elements.length
    },
    topElements: elements.slice(0, 5)
  };
})();
