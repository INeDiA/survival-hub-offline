import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItemsByBag, saveItem, deleteItem, getAllItems } from "@/lib/db";
import type { Item } from "@/lib/types";

export function useItems(bagId: string) {
  return useQuery({
    queryKey: ["items", bagId],
    queryFn: () => getItemsByBag(bagId),
  });
}

export function useAllItems() {
  return useQuery({ queryKey: ["items"], queryFn: getAllItems });
}

export function useSaveItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveItem,
    onSuccess: (_data, item) => {
      qc.invalidateQueries({ queryKey: ["items", item.bagId] });
      qc.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
