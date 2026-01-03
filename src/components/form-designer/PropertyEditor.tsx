import { useCallback, useMemo, useState } from 'react';
import { Settings, Trash2, Plus, X, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    useFormDesignerStore,
    useSelectedComponent,
} from '@/store/form-designer-store';
import { getComponentRegistration } from './components';
import type { PropertyDefinition, FormComponentProps } from '@/types/form-designer';

// ============================================================================
// Options Editor Component
// ============================================================================

interface OptionsEditorProps {
    options: { label: string; value: string }[];
    onChange: (options: { label: string; value: string }[]) => void;
}

function OptionsEditor({ options, onChange }: OptionsEditorProps) {
    const [newLabel, setNewLabel] = useState('');

    const addOption = () => {
        if (!newLabel.trim()) return;
        const value = `option_${Date.now()}`;
        onChange([...options, { label: newLabel.trim(), value }]);
        setNewLabel('');
    };

    const removeOption = (index: number) => {
        onChange(options.filter((_, i) => i !== index));
    };

    const updateOption = (index: number, label: string) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], label };
        onChange(newOptions);
    };

    return (
        <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">选项配置</Label>

            {/* Options List */}
            <div className="space-y-2">
                {options.map((option, index) => (
                    <div key={option.value} className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <Input
                            value={option.label}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="h-8 flex-1 text-sm"
                            placeholder="选项文本"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10"
                            onClick={() => removeOption(index)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Add New Option */}
            <div className="flex items-center gap-2">
                <Input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="新增选项..."
                    className="h-8 flex-1 text-sm"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addOption();
                        }
                    }}
                />
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={addOption}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// Property Field Renderer
// ============================================================================

interface PropertyFieldProps {
    property: PropertyDefinition;
    value: unknown;
    onChange: (key: string, value: unknown) => void;
}

function PropertyField({ property, value, onChange }: PropertyFieldProps) {
    const handleChange = useCallback(
        (newValue: unknown) => {
            onChange(property.key, newValue);
        },
        [property.key, onChange]
    );

    switch (property.type) {
        case 'string':
            return (
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                        {property.label}
                    </Label>
                    <Input
                        value={(value as string) || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder={property.placeholder}
                        className="h-8 text-sm"
                    />
                </div>
            );

        case 'number':
            return (
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                        {property.label}
                    </Label>
                    <Input
                        type="number"
                        value={(value as number) ?? ''}
                        onChange={(e) =>
                            handleChange(
                                e.target.value ? parseFloat(e.target.value) : undefined
                            )
                        }
                        min={property.min}
                        max={property.max}
                        step={property.step}
                        className="h-8 text-sm"
                    />
                </div>
            );

        case 'boolean':
            return (
                <div className="flex items-center justify-between py-1">
                    <Label className="text-xs text-muted-foreground">
                        {property.label}
                    </Label>
                    <Switch
                        checked={!!value}
                        onCheckedChange={handleChange}
                        className="scale-90"
                    />
                </div>
            );

        case 'select':
            return (
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                        {property.label}
                    </Label>
                    <Select value={value as string} onValueChange={handleChange}>
                        <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {property.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value as string}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );

        default:
            return null;
    }
}

// ============================================================================
// Empty State
// ============================================================================

function EmptyPropertyEditor() {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
                <Settings className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-sm font-medium">未选择组件</h3>
            <p className="text-xs text-muted-foreground">
                点击画布中的组件以编辑其属性
            </p>
        </div>
    );
}

// ============================================================================
// Property Editor
// ============================================================================

export function PropertyEditor() {
    const selectedComponent = useSelectedComponent();
    const updateComponent = useFormDesignerStore((state) => state.updateComponent);
    const removeComponent = useFormDesignerStore((state) => state.removeComponent);

    const registration = useMemo(() => {
        if (!selectedComponent) return null;
        return getComponentRegistration(selectedComponent.type);
    }, [selectedComponent]);

    const handlePropertyChange = useCallback(
        (key: string, value: unknown) => {
            if (!selectedComponent) return;
            updateComponent(selectedComponent.id, {
                [key]: value,
            } as Partial<FormComponentProps>);
        },
        [selectedComponent, updateComponent]
    );

    const handleOptionsChange = useCallback(
        (options: { label: string; value: string }[]) => {
            if (!selectedComponent) return;
            updateComponent(selectedComponent.id, {
                options,
            } as Partial<FormComponentProps>);
        },
        [selectedComponent, updateComponent]
    );

    const handleDelete = useCallback(() => {
        if (!selectedComponent) return;
        removeComponent(selectedComponent.id);
    }, [selectedComponent, removeComponent]);

    // Check if component has options (select, radio)
    const hasOptions =
        selectedComponent?.type === 'select' || selectedComponent?.type === 'radio';
    const currentOptions =
        (selectedComponent?.props as { options?: { label: string; value: string }[] })
            ?.options || [];

    if (!selectedComponent || !registration) {
        return (
            <div className="flex h-full w-72 flex-col border-l border-border bg-card/50 backdrop-blur-sm">
                <div className="flex-shrink-0 border-b border-border p-4">
                    <h2 className="text-lg font-semibold">属性配置</h2>
                </div>
                <EmptyPropertyEditor />
            </div>
        );
    }

    return (
        <div className="flex h-full w-72 flex-col border-l border-border bg-card/50 backdrop-blur-sm">
            {/* Header */}
            <div className="flex-shrink-0 border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">属性配置</h2>
                        <p className="text-xs text-muted-foreground">{registration.name}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Properties */}
            <ScrollArea className="flex-1">
                <div className="space-y-4 p-4">
                    {/* Component ID (readonly) */}
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">组件 ID</Label>
                        <Input
                            value={selectedComponent.id}
                            disabled
                            className="h-8 font-mono text-xs"
                        />
                    </div>

                    <Separator />

                    {/* Dynamic Properties */}
                    {registration.properties.map((property) => (
                        <PropertyField
                            key={property.key}
                            property={property}
                            value={
                                selectedComponent.props[
                                property.key as keyof typeof selectedComponent.props
                                ]
                            }
                            onChange={handlePropertyChange}
                        />
                    ))}

                    {/* Options Editor for Select/Radio */}
                    {hasOptions && (
                        <>
                            <Separator />
                            <OptionsEditor
                                options={currentOptions}
                                onChange={handleOptionsChange}
                            />
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
