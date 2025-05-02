// 多字节安全的中文截断过滤器
hexo.extend.helper.register('truncate_cn', function(str, length = 150, end = '...') {
  if (!str) return '';
  let result = '';
  let count = 0;
  for (let char of str) {
    count++;
    if (count > length) break;
    result += char;
  }
  if (str.length > result.length) result += end;
  return result;
}); 