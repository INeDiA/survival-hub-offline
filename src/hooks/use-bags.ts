import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBags, saveBag, deleteBag, getBag } from "@/lib/db";
import type { Bag } from "@/lib/types";

export function useBags() {
  return useQuery({ queryKey: ["bags"], queryFn: getAllBags });
}

export function useBag(id: string) {
  return useQuery({ queryKey: ["bags", id], queryFn: () => getBag(id) });
}

export function useSaveBag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveBag,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bags"] }),
  });
}

export function useDeleteBag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBag,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bags"] });
      qc.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
