import { ref } from 'vue'

const cache = new Map<string, string>()

export function getSvgHtml() {
  const svgHtml = ref('')

  const loadSvg = async (url: string) => {
    if (cache.has(url)) {
      svgHtml.value = cache.get(url)!
      return
    }

    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Error al cargar el SVG')

      const text = await response.text()

      const replaced = text
        // Reemplaza atributos fill="..."
        .replace(/fill="(?!none|currentColor)[^"]*"/gi, 'fill="currentColor"')
        // Reemplaza fill dentro del style
        .replace(/fill:\s*(?!none|currentColor)[^;"]*/gi, 'fill:currentColor')

      cache.set(url, replaced)
      svgHtml.value = replaced
    } catch {
      svgHtml.value = ''
    }
  }

  return {
    svgHtml,
    loadSvg,
  }
}