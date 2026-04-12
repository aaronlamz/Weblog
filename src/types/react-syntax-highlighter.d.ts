declare module 'react-syntax-highlighter/dist/cjs/prism-light' {
  import { ComponentType } from 'react'
  const SyntaxHighlighter: ComponentType<any> & {
    registerLanguage: (name: string, lang: any) => void
  }
  export default SyntaxHighlighter
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus' {
  const style: Record<string, any>
  export default style
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism/one-light' {
  const style: Record<string, any>
  export default style
}

declare module 'react-syntax-highlighter/dist/cjs/languages/prism/*' {
  const language: any
  export default language
}
