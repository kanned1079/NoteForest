export const useFormatTags = (tagsStr: string): string[] => {
    if (tagsStr.trim()) {
        return tagsStr
            .match(/\[(.*?)\]/g)                // 匹配所有 [内容]
            ?.map(tag => tag.slice(1, -1).trim()) // 去掉 [] 并 trim
            .filter(tag => tag.length > 0) || []  // 过滤空标签，确保返回数组
    } else {
        return []
    }
}