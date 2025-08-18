/* import React from 'react'; */

export const TestComponent = () => {
  return (
    <div className="p-4 bg-red-500 text-white">
      <h1 className="text-2xl font-bold">Teste Tailwind</h1>
      <div className="mt-4 p-4 bg-cinza rounded">
        <p className="text-verde-escuro">Cor personalizada: Verde escuro</p>
        <p className="text-verde-claro">Cor personalizada: Verde claro</p>
        <p className="text-texto">Cor personalizada: Texto</p>
      </div>
      <div className="mt-4 p-4 bg-fundo-claro border border-strokes rounded">
        <p>Fundo claro com borda strokes</p>
      </div>
    </div>
  );
};
