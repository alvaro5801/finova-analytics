"use client";

import { useEffect } from "react";

/**
 * Marca `<html data-app-ready>` depois que o React hidrata a página.
 *
 * Fica por último na raiz: os efeitos rodam dos filhos para os pais e dos irmãos anteriores
 * para os posteriores, então quando este roda, os event listeners do resto da página
 * (atalhos de teclado, cliques, hover dos gráficos) já existem. O HTML pré-renderizado
 * aparece antes disso, e os testes E2E esperam este sinal para não interagir cedo demais.
 */
export function AppReadyMarker() {
  useEffect(() => {
    document.documentElement.dataset.appReady = "true";
  }, []);
  return null;
}
