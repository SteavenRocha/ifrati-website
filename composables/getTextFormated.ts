export function getTextFormated(initialText?: string) {
  return initialText
    // Primero reemplaza los dobles asteriscos para evitar conflictos con simples
    ?.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')
    // Luego reemplaza los simples asteriscos
    .replace(/\*(?!\*)(.*?)\*(?!\*)/g, '<span class="bold">$1</span>')
    // Reemplaza saltos de línea por <br>
    .replace(/\n/g, '<br>')
}