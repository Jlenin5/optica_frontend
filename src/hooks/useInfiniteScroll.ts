import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  threshold = 0.1,
  rootMargin = "100px"
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbackRef = useRef(onLoadMore);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  // Mantener referencias actualizadas
  useEffect(() => {
    callbackRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (
        entry.isIntersecting &&
        hasMoreRef.current &&
        !loadingRef.current
      ) {
        callbackRef.current();
      }
    },
    []
  );

  useEffect(() => {
    // Limpiar observer anterior
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // No crear observer si no hay más datos
    if (!hasMore) {
      return;
    }

    // Crear nuevo observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin,
      threshold
    });

    // Observar el elemento sentinel si existe
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, handleIntersection, rootMargin, threshold]);

  // Función para asignar el ref manualmente (útil si el sentinel se renderiza condicionalmente)
  const setSentinelRef = useCallback((node: HTMLDivElement | null) => {
    // Limpiar observer del nodo anterior
    if (observerRef.current && sentinelRef.current) {
      observerRef.current.unobserve(sentinelRef.current);
    }

    sentinelRef.current = node;

    // Observar nuevo nodo
    if (observerRef.current && node) {
      observerRef.current.observe(node);
    }
  }, []);

  return {
    sentinelRef: setSentinelRef,
    sentinelProps: {
      ref: setSentinelRef
    }
  };
};