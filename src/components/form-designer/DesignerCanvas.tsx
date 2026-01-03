import { useCallback, useState } from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
    useFormDesignerStore,
    useComponents,
    useSelectedId,
    useDragState,
    useIsPreviewMode,
} from '@/store/form-designer-store';
import { getComponentRenderer } from './components';
import type { ComponentType, CanvasComponent } from '@/types/form-designer';
import { cn } from '@/lib/utils';

// ============================================================================
// Width Classes Mapping
// ============================================================================

const widthClasses: Record<string, string> = {
    full: 'w-full',
    '1/2': 'w-[calc(50%-0.5rem)]',
    '1/3': 'w-[calc(33.333%-0.5rem)]',
    '1/4': 'w-[calc(25%-0.5rem)]',
};

// ============================================================================
// Canvas Component Item
// ============================================================================

interface CanvasItemProps {
    component: CanvasComponent;
    isSelected: boolean;
    index: number;
    isPreview: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onDragStart: (e: React.DragEvent, index: number) => void;
    onDragOver: (e: React.DragEvent, index: number) => void;
    onDrop: (e: React.DragEvent, index: number) => void;
}

function CanvasItem({
    component,
    isSelected,
    index,
    isPreview,
    onSelect,
    onDelete,
    onDragStart,
    onDragOver,
    onDrop,
}: CanvasItemProps) {
    const [isHovering, setIsHovering] = useState(false);
    const renderer = getComponentRenderer(component.type);

    if (isPreview) {
        return (
            <div className={cn(widthClasses[component.props.width] || 'w-full')}>
                <div className="p-2">
                    {renderer ? renderer(component.props) : <div>Unknown component</div>}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                widthClasses[component.props.width] || 'w-full',
                'group relative transition-all duration-200'
            )}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
        >
            {/* Selection Border */}
            <div
                className={cn(
                    'relative rounded-lg border-2 p-4 transition-all duration-200',
                    isSelected
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                        : 'border-transparent hover:border-border hover:bg-accent/50',
                    isSelected && 'ring-2 ring-primary/20'
                )}
            >
                {/* Drag Handle */}
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, index)}
                    className={cn(
                        'absolute left-1 top-1/2 -translate-y-1/2 cursor-grab rounded p-1 opacity-0 transition-opacity duration-200 hover:bg-accent active:cursor-grabbing',
                        (isHovering || isSelected) && 'opacity-100'
                    )}
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* Delete Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 shadow-md transition-all duration-200 hover:scale-110 hover:bg-destructive',
                        (isHovering || isSelected) && 'opacity-100'
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>

                {/* Component Renderer */}
                <div className="pointer-events-none pl-4">
                    {renderer ? renderer(component.props) : <div>Unknown component</div>}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Empty Canvas State
// ============================================================================

function EmptyCanvas() {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-6">
                <svg
                    className="h-12 w-12 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">开始设计您的表单</h3>
            <p className="max-w-[280px] text-sm text-muted-foreground">
                从左侧组件库拖拽组件到此处，或点击组件直接添加
            </p>
        </div>
    );
}

// ============================================================================
// Designer Canvas
// ============================================================================

export function DesignerCanvas() {
    const components = useComponents();
    const selectedId = useSelectedId();
    const isPreviewMode = useIsPreviewMode();
    const dragState = useDragState();

    const addComponent = useFormDesignerStore((state) => state.addComponent);
    const removeComponent = useFormDesignerStore((state) => state.removeComponent);
    const selectComponent = useFormDesignerStore((state) => state.selectComponent);
    const reorderComponents = useFormDesignerStore((state) => state.reorderComponents);
    const setDragState = useFormDesignerStore((state) => state.setDragState);

    const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null);

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = dragState.draggedId ? 'move' : 'copy';
        },
        [dragState.draggedId]
    );

    const handleDragLeave = useCallback(() => {
        setDropIndicatorIndex(null);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent, targetIndex?: number) => {
            e.preventDefault();
            setDropIndicatorIndex(null);

            const componentType = e.dataTransfer.getData('componentType') as ComponentType;
            const draggedIndexString = e.dataTransfer.getData('draggedIndex');

            if (draggedIndexString) {
                // Reordering existing component
                const fromIndex = parseInt(draggedIndexString, 10);
                const toIndex = targetIndex ?? components.length;
                if (fromIndex !== toIndex && fromIndex !== toIndex - 1) {
                    reorderComponents(fromIndex, fromIndex < toIndex ? toIndex - 1 : toIndex);
                }
            } else if (componentType) {
                // Adding new component
                addComponent(componentType, targetIndex);
            }
        },
        [components.length, addComponent, reorderComponents]
    );

    const handleItemDragStart = useCallback(
        (e: React.DragEvent, index: number) => {
            e.dataTransfer.setData('draggedIndex', index.toString());
            e.dataTransfer.effectAllowed = 'move';
            setDragState({
                isDragging: true,
                draggedType: null,
                draggedId: components[index].id,
            });
        },
        [components, setDragState]
    );

    const handleItemDragOver = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();

        const element = e.currentTarget as HTMLElement;
        const rect = element.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;

        if (e.clientY >= midY) {
            setDropIndicatorIndex(index + 1);
        } else {
            setDropIndicatorIndex(index);
        }
    }, []);

    const handleItemDrop = useCallback(
        (e: React.DragEvent, index: number) => {
            e.stopPropagation();

            const element = e.currentTarget as HTMLElement;
            const rect = element.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            const targetIndex = e.clientY >= midY ? index + 1 : index;
            handleDrop(e, targetIndex);
        },
        [handleDrop]
    );

    const handleSelect = useCallback(
        (id: string) => {
            selectComponent(id);
        },
        [selectComponent]
    );

    const handleDelete = useCallback(
        (id: string) => {
            removeComponent(id);
        },
        [removeComponent]
    );

    const handleCanvasClick = useCallback(() => {
        selectComponent(null);
    }, [selectComponent]);

    return (
        <div
            className={cn(
                'flex-1 transition-all duration-300',
                dragState.isDragging && 'bg-primary/5'
            )}
            onClick={handleCanvasClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e)}
        >
            <ScrollArea className="h-full">
                <div className="mx-auto max-w-4xl p-8">
                    {/* Canvas Container */}
                    <div
                        className={cn(
                            'min-h-[600px] rounded-xl border-2 bg-card p-6 shadow-sm transition-all duration-300',
                            isPreviewMode
                                ? 'border-border'
                                : dragState.isDragging
                                    ? 'border-primary border-dashed bg-primary/5'
                                    : 'border-dashed border-border',
                            components.length === 0 && 'flex items-center justify-center'
                        )}
                    >
                        {components.length === 0 ? (
                            <EmptyCanvas />
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {components.map((component, index) => (
                                    <div key={component.id} className="contents">
                                        {/* Drop Indicator - Logic updated for before/after */}
                                        {dropIndicatorIndex === index && !isPreviewMode && (
                                            <div className="h-1 w-full animate-pulse rounded-full bg-primary" />
                                        )}
                                        <CanvasItem
                                            component={component}
                                            isSelected={selectedId === component.id}
                                            index={index}
                                            isPreview={isPreviewMode}
                                            onSelect={() => handleSelect(component.id)}
                                            onDelete={() => handleDelete(component.id)}
                                            onDragStart={handleItemDragStart}
                                            onDragOver={handleItemDragOver}
                                            onDrop={handleItemDrop}
                                        />
                                        {/* Handle last item indicator separately or let loop handle it */}
                                        {/* If we are at the last item and indicator is index + 1, show it here? 
                                             Actually, the loop shows indicator AT index. 
                                             If index+1 == components.length, we need to show it after the last item.
                                         */}
                                        {dropIndicatorIndex === index + 1 && index === components.length - 1 && !isPreviewMode && (
                                            <div className="h-1 w-full animate-pulse rounded-full bg-primary" />
                                        )}
                                    </div>
                                ))}
                                {/* End Drop Zone */}
                                {!isPreviewMode && (
                                    <div
                                        className="h-16 w-full"
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDropIndicatorIndex(components.length);
                                        }}
                                        onDrop={(e) => {
                                            e.stopPropagation(); // FIX: Stop propagation to prevent duplicate add
                                            handleDrop(e, components.length);
                                        }}
                                    >
                                        {/* Only show if we dragged directly over the empty space, not just "after last item" which is handled in loop */}
                                        {dropIndicatorIndex === components.length && (
                                            <div className="h-1 w-full animate-pulse rounded-full bg-primary" />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
