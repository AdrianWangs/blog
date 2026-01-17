(function() {
    'use strict';
    
    function isDarkMode() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ||
               document.body.classList.contains('dark-mode') ||
               document.documentElement.classList.contains('dark');
    }

    function updateEchartsTheme() {
        const dark = isDarkMode();
        const charts = document.querySelectorAll('[id^="heatmapChart-"], [id^="pieChart-"], [id^="radarChart-"]');
        
        const textColor = dark ? '#ccc' : '#333';
        const labelColor = dark ? '#eee' : '#333';
        
        charts.forEach(function(chartDom) {
            const chartInstance = echarts.getInstanceByDom(chartDom);
            if (chartInstance) {
                const currentOption = chartInstance.getOption();
                chartInstance.dispose();
                
                const newChart = echarts.init(chartDom, dark ? 'dark' : 'light');
                
                if (currentOption) {
                    currentOption.backgroundColor = dark ? '#333' : 'transparent';
                    
                    if (currentOption.calendar && currentOption.calendar[0]) {
                        currentOption.calendar[0].itemStyle = currentOption.calendar[0].itemStyle || {};
                        currentOption.calendar[0].itemStyle.color = dark ? '#333' : 'transparent';
                        currentOption.calendar[0].splitLine = currentOption.calendar[0].splitLine || {};
                        currentOption.calendar[0].splitLine.lineStyle = currentOption.calendar[0].splitLine.lineStyle || {};
                        currentOption.calendar[0].splitLine.lineStyle.color = dark ? '#555' : '#E0E0E0';
                        currentOption.calendar[0].itemStyle.borderColor = dark ? '#555' : '#E0E0E0';
                    }
                    
                    if (currentOption.series) {
                        currentOption.series.forEach(function(s) {
                            if (s.type === 'pie' || s.type === 'radar') {
                                s.label = s.label || {};
                                s.label.color = labelColor;
                                s.label.textStyle = s.label.textStyle || {};
                                s.label.textStyle.color = labelColor;
                            }
                        });
                    }
                    
                    if (currentOption.legend) {
                        currentOption.legend.forEach(function(leg) {
                            leg.textStyle = leg.textStyle || {};
                            leg.textStyle.color = textColor;
                        });
                    }
                    
                    if (currentOption.radar) {
                        currentOption.radar.forEach(function(r) {
                            r.axisName = r.axisName || {};
                            r.axisName.color = textColor;
                            r.name = r.name || {};
                            r.name.textStyle = r.name.textStyle || {};
                            r.name.textStyle.color = textColor;
                        });
                    }
                    
                    newChart.setOption(currentOption);
                }
            }
        });
    }

    function observeThemeChange() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')) {
                    setTimeout(updateEchartsTheme, 100);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class']
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    function initThemeAdapter() {
        setTimeout(function() {
            updateEchartsTheme();
        }, 500);
        
        observeThemeChange();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeAdapter);
    } else {
        initThemeAdapter();
    }
})();
