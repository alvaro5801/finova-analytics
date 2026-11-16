"use client";

import { useEffect, useRef } from "react";
import type { PluggyConnectProps } from "pluggy-connect-sdk";

/**
 * Widget oficial da Pluggy, criado UMA vez por sessão de conexão e destruído ao sair.
 *
 * O componente `react-pluggy-connect` cria uma instância nova a cada montagem e nunca
 * destrói a anterior. No modo de desenvolvimento o React monta duas vezes (Strict Mode),
 * nasciam dois widgets, e no MeuPluggy (login por OAuth) a segunda sessão de login
 * invalidava a primeira ("opened too many login dialogs").
 */
export function PluggyConnectWidget(props: PluggyConnectProps) {
  // Callbacks sempre atualizados sem reiniciar o widget a cada renderização.
  const latest = useRef(props);
  useEffect(() => {
    latest.current = props;
  });

  const { connectToken, selectedConnectorId, includeSandbox, language, theme, countries } = props;

  useEffect(() => {
    let cancelled = false;
    let instance: { destroy(): Promise<void> } | null = null;

    // Import dinâmico: o SDK acessa `window` ao carregar. Como ele resolve depois desta
    // função, a primeira montagem do Strict Mode já foi cancelada quando chega aqui.
    import("pluggy-connect-sdk").then(({ PluggyConnect }) => {
      if (cancelled) return;
      const widget = new PluggyConnect({
        connectToken,
        selectedConnectorId,
        includeSandbox,
        language,
        theme,
        countries,
        onSuccess: (data) => latest.current.onSuccess?.(data),
        onError: (error) => latest.current.onError?.(error),
        onClose: () => latest.current.onClose?.(),
        onOpen: () => latest.current.onOpen?.(),
      });
      instance = widget;
      widget.init().catch((error: unknown) => {
        latest.current.onError?.({ message: error instanceof Error ? error.message : "Falha ao abrir o widget." });
      });
    });

    return () => {
      cancelled = true;
      instance?.destroy().catch(() => undefined);
    };
  }, [connectToken, selectedConnectorId, includeSandbox, language, theme, countries]);

  return null;
}
