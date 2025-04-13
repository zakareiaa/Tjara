import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PRODUCT_ATTRIBUTE_ITEMS from './productAttributeItemsClient';

// Query key factory to maintain consistency
const queryKeys = {
    all: ['productAttributeItems'],
    lists: () => [...queryKeys.all, 'list'],
    list: (filters) => [...queryKeys.lists(), filters],
    details: () => [...queryKeys.all, 'detail'],
    detail: (slug) => [...queryKeys.details(), slug],
};

// Hook for fetching product attribute items with filters
export const useProductAttributeItems = (params = {}) => {
    return useQuery({
        queryKey: queryKeys.list(params),
        queryFn: () => PRODUCT_ATTRIBUTE_ITEMS.getProductAttributeItems(params),
        // You can customize options here
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 60 * 60 * 1000, // 1 hour
    });
};

// Hook for fetching a single product attribute item
export const useProductAttributeItem = (slug, params = {}) => {
    return useQuery({
        queryKey: queryKeys.detail(slug),
        queryFn: () => PRODUCT_ATTRIBUTE_ITEMS.getProductAttributeItem(slug, params),
        enabled: !!slug, // Only run if slug is provided
    });
};

// Hook for creating a new product attribute item
export const useCreateProductAttributeItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => PRODUCT_ATTRIBUTE_ITEMS.createProductAttributeItem(data),
        onSuccess: () => {
            // Invalidate relevant queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
        },
    });
};

// Hook for updating a product attribute item
export const useUpdateProductAttributeItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ slug, data }) => PRODUCT_ATTRIBUTE_ITEMS.updateProductAttributeItem(slug, data),
        onSuccess: (_, variables) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.slug) });
            queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
        },
    });
};

// Hook for deleting a product attribute item
export const useDeleteProductAttributeItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug) => PRODUCT_ATTRIBUTE_ITEMS.deleteProductAttributeItem(slug),
        onSuccess: () => {
            // Invalidate and refetch list queries
            queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
        },
    });
};