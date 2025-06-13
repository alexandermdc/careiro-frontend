# Projeto Feira Online

Este é um projeto de feira online desenvolvido pelo **ICE Itacoatiara** da **UFAM**, em parceria com o **ICOM**. O objetivo é criar uma plataforma moderna para conectar feirantes e consumidores, facilitando a compra e venda de produtos locais de forma prática e segura.

---

## Tecnologias Utilizadas

- **React**
- **TypeScript**
- **Vite**

Este template fornece uma configuração mínima para iniciar um projeto React com Vite, incluindo HMR e algumas regras de ESLint.

Atualmente, dois plugins oficiais estão disponíveis:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) utiliza [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) utiliza [SWC](https://swc.rs/) para Fast Refresh

## Expansão da configuração do ESLint

Se você está desenvolvendo uma aplicação para produção, recomendamos atualizar a configuração para habilitar regras de lint com verificação de tipos:

```js
export default tseslint.config({
  extends: [
    // Remova ...tseslint.configs.recommended e substitua por isto
    ...tseslint.configs.recommendedTypeChecked,
    // Opcionalmente, use isto para regras mais restritas
    ...tseslint.configs.strictTypeChecked,
    // Opcionalmente, adicione isto para regras de estilo
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // outras opções...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

Você também pode instalar [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) e [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) para regras específicas do React:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Adicione os plugins react-x e react-dom
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // outras regras...
    // Habilite as regras recomendadas para typescript
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
