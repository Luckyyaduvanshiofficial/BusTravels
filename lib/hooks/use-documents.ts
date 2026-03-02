// useDocuments hook - Upload and manage documents
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Stub API — replace with real Supabase storage calls when implementing document uploads
const documentsApi = {
  getAll: async () => ({ data: [] as Array<{ id: string; name: string; url: string }> }),
  upload: async (_formData: FormData) => ({ data: null }),
  delete: async (_id: string) => ({ data: null }),
};

export function useDocuments() {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentsApi.getAll(),
  });

  const documents = response?.data || [];

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => documentsApi.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  return {
    documents,
    isLoading,
    uploadDocument: uploadMutation.mutate,
    deleteDocument: deleteMutation.mutate,
    isUploading: uploadMutation.isPending,
  };
}
