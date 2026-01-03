import { Columns2 } from 'lucide-react';
import {
    type ComponentRegistration,
    type BaseComponentProps,
    type PropertyDefinition,
} from '@/types/form-designer';
import { registerComponent } from './registry';

// ============================================================================
// Grid Layout Specific Types
// ============================================================================

export interface GridComponentProps extends BaseComponentProps {
    type: 'grid';
    columns: number;
    gap: number;
}

// ============================================================================
// Properties Definition
// ============================================================================

export const gridProperties: PropertyDefinition[] = [
    {
        key: 'columns',
        label: '列数',
        type: 'number',
        defaultValue: 2,
        min: 1,
        max: 4,
    },
    {
        key: 'gap',
        label: '间距 (px)',
        type: 'number',
        defaultValue: 16,
        min: 0,
        max: 100,
    },
    {
        key: 'width',
        label: '宽度',
        type: 'select',
        defaultValue: 'full',
        options: [
            { label: '100%', value: 'full' },
            { label: '50%', value: '1/2' },
        ],
    },
];

// ============================================================================
// Renderer
// ============================================================================

// Note: In a full implementation, this Grid component would be a "container"
// that can hold other components. For now, we'll implement it as a layout 
// helper or a visual row divider.
function GridRenderer(props: GridComponentProps) {
    const { columns, gap, label } = props;

    return (
        <div className="space-y-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
                <Columns2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">{label}</span>
            </div>
            <div
                className="grid min-h-[60px] items-center justify-center rounded border border-dashed border-primary/20 bg-background/50"
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: `${gap}px`
                }}
            >
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="flex h-12 items-center justify-center rounded bg-accent/30 text-[10px] text-muted-foreground italic">
                        列 {i + 1} 预留
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 text-center">
                提示：栅格容器，用于横向排列多个组件
            </p>
        </div>
    );
}

// ============================================================================
// Registration
// ============================================================================

const gridRegistration: ComponentRegistration = {
    type: 'grid' as any, // Temporary cast as we'll update ComponentType soon
    category: 'layout',
    name: '栅格布局',
    icon: 'Columns2',
    description: '横向多列布局容器',
    defaultProps: {
        label: '多列布局',
        columns: 2,
        gap: 16,
        width: 'full',
    },
    properties: gridProperties,
};

registerComponent(gridRegistration as any, GridRenderer as any);
