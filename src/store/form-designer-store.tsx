import { create } from 'zustand';
import { temporal } from 'zundo';
import {
    type FormDesignerState,
    type ComponentType,
    type CanvasComponent,
    type DragState,
    type FormComponentProps,
} from '@/types/form-designer';
import { getComponentRegistration } from '@/components/form-designer/components/registry';

// ============================================================================
// Initial State
// ============================================================================

const initialDragState: DragState = {
    isDragging: false,
    draggedType: null,
    draggedId: null,
    dropIndex: null,
};

// ============================================================================
// Helper Functions
// ============================================================================

function generateId(): string {
    return `component_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function createComponent(componentType: ComponentType): CanvasComponent {
    const registration = getComponentRegistration(componentType);
    const id = generateId();

    return {
        id,
        type: componentType,
        props: {
            id,
            type: componentType,
            label: registration?.name || componentType,
            width: 'full',
            required: false,
            disabled: false,
            ...registration?.defaultProps,
        } as CanvasComponent['props'],
    };
}

// ============================================================================
// Store Interface
// ============================================================================

interface FormDesignerStore extends FormDesignerState {
    isPreviewMode: boolean;

    // Actions
    addComponent: (componentType: ComponentType, index?: number) => void;
    removeComponent: (id: string) => void;
    selectComponent: (id: string | null) => void;
    updateComponent: (id: string, props: Partial<FormComponentProps>) => void;
    reorderComponents: (fromIndex: number, toIndex: number) => void;
    setDragState: (dragState: Partial<DragState>) => void;
    clearCanvas: () => void;

    // Import/Export
    importFromJSON: (json: string) => boolean;
    exportToJSON: () => string;

    // Preview mode
    setPreviewMode: (preview: boolean) => void;
}

// ============================================================================
// Zustand Store with Undo/Redo (zundo)
// ============================================================================

export const useFormDesignerStore = create<FormDesignerStore>()(
    temporal(
        (set, get) => ({
            // State
            components: [],
            selectedId: null,
            dragState: initialDragState,
            isPreviewMode: false,

            // Actions
            addComponent: (componentType, index) => {
                const newComponent = createComponent(componentType);
                set((state) => {
                    const newComponents = [...state.components];
                    const insertIndex = index ?? newComponents.length;
                    newComponents.splice(insertIndex, 0, newComponent);
                    return {
                        components: newComponents,
                        selectedId: newComponent.id,
                    };
                });
            },

            removeComponent: (id) => {
                set((state) => ({
                    components: state.components.filter((c) => c.id !== id),
                    selectedId: state.selectedId === id ? null : state.selectedId,
                }));
            },

            selectComponent: (id) => {
                set({ selectedId: id });
            },

            updateComponent: (id, props) => {
                set((state) => ({
                    components: state.components.map((c) =>
                        c.id === id ? { ...c, props: { ...c.props, ...props } as any } : c
                    ),
                }));
            },

            reorderComponents: (fromIndex, toIndex) => {
                set((state) => {
                    const newComponents = [...state.components];
                    const [removed] = newComponents.splice(fromIndex, 1);
                    newComponents.splice(toIndex, 0, removed);
                    return {
                        components: newComponents,
                    };
                });
            },

            setDragState: (dragState) => {
                set((state) => ({
                    dragState: { ...state.dragState, ...dragState },
                }));
            },

            clearCanvas: () => {
                set({
                    components: [],
                    selectedId: null,
                });
            },

            // Import/Export
            importFromJSON: (json) => {
                try {
                    const data = JSON.parse(json);
                    // Try to handle both {components: []} and just []
                    const components = Array.isArray(data) ? data : data.components;

                    if (Array.isArray(components)) {
                        set({
                            components: components as CanvasComponent[],
                            selectedId: null,
                        });
                        return true;
                    }
                    return false;
                } catch {
                    return false;
                }
            },

            exportToJSON: () => {
                const { components } = get();
                return JSON.stringify({ components }, null, 2);
            },

            // Preview mode
            setPreviewMode: (preview) => {
                set({ isPreviewMode: preview, selectedId: null });
            },
        }),
        {
            limit: 50,
            // Focus undo/redo on component data
            partialize: (state) => ({
                components: state.components as any,
            }),
        }
    )
);

// ============================================================================
// Direct Selectors (Better for Performance)
// ============================================================================

export const useComponents = () => useFormDesignerStore((state) => state.components);
export const useSelectedId = () => useFormDesignerStore((state) => state.selectedId);
export const useIsDragging = () => useFormDesignerStore((state) => state.dragState.isDragging);
export const useIsPreviewMode = () => useFormDesignerStore((state) => state.isPreviewMode);

export function useSelectedComponent(): CanvasComponent | null {
    const components = useComponents();
    const selectedId = useSelectedId();
    return components.find((c) => c.id === selectedId) || null;
}

export function useDragState(): DragState {
    return useFormDesignerStore((state) => state.dragState);
}

// Undo/Redo access
export const useTemporalStore = () => useFormDesignerStore.temporal;
