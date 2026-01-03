import { useMemo } from 'react';
import * as Icons from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFormDesignerStore } from '@/store/form-designer-store';
import { getAllCategories, getComponentsByCategory } from './components';
import type { ComponentType } from '@/types/form-designer';

// ============================================================================
// Component Palette Item
// ============================================================================

interface PaletteItemProps {
    type: ComponentType;
    name: string;
    icon: string;
    description: string;
}

function PaletteItem({ type, name, icon, description }: PaletteItemProps) {
    const setDragState = useFormDesignerStore((state) => state.setDragState);

    // Get icon component dynamically
    const IconComponent = useMemo(() => {
        const iconName = icon as keyof typeof Icons;
        return (Icons[iconName] as Icons.LucideIcon) || Icons.Box;
    }, [icon]);

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('componentType', type);
        e.dataTransfer.effectAllowed = 'copy';

        setDragState({ isDragging: true, draggedType: type, draggedId: null });

        // Create custom drag image
        const dragPreview = document.createElement('div');
        dragPreview.className =
            'fixed bg-card border-2 border-primary rounded-lg px-4 py-2 shadow-2xl flex items-center gap-2 pointer-events-none';
        dragPreview.innerHTML = `<span class="text-sm font-medium">${name}</span>`;
        dragPreview.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(dragPreview);
        e.dataTransfer.setDragImage(dragPreview, 60, 20);
        setTimeout(() => {
            if (document.body.contains(dragPreview)) {
                document.body.removeChild(dragPreview);
            }
        }, 0);
    };

    const handleDragEnd = () => {
        setDragState({ isDragging: false, draggedType: null, draggedId: null });
    };

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        draggable
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        className="group flex cursor-grab items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:scale-[1.02] hover:border-primary/50 hover:bg-accent hover:shadow-md active:cursor-grabbing active:scale-[0.98]"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">{name}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px]">
                    <p className="text-xs">{description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// ============================================================================
// Component Palette
// ============================================================================

export function ComponentPalette() {
    const categories = getAllCategories();

    return (
        <div className="flex h-full w-64 flex-col border-r border-border bg-card/50 backdrop-blur-sm">
            {/* Header */}
            <div className="flex-shrink-0 border-b border-border p-4">
                <h2 className="text-lg font-semibold">组件库</h2>
                <p className="text-xs text-muted-foreground">拖拽组件到画布</p>
            </div>

            {/* Component List */}
            <ScrollArea className="flex-1">
                <div className="space-y-6 p-4">
                    {categories.map((category, index) => {
                        const components = getComponentsByCategory(category.id);
                        if (components.length === 0) return null;

                        const iconName = category.icon as keyof typeof Icons;
                        const CategoryIcon =
                            (Icons[iconName] as Icons.LucideIcon) || Icons.Folder;

                        return (
                            <div key={category.id}>
                                {index > 0 && <Separator className="mb-4" />}
                                <div className="mb-3 flex items-center gap-2">
                                    <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        {category.name}
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    {components.map((component) => (
                                        <PaletteItem
                                            key={component.type}
                                            type={component.type}
                                            name={component.name}
                                            icon={component.icon}
                                            description={component.description}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
