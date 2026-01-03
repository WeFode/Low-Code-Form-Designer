import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    type ComponentRegistration,
    type SelectComponentProps,
    type PropertyDefinition,
} from '@/types/form-designer';
import { registerComponent } from './registry';

// ============================================================================
// Properties Definition
// ============================================================================

export const selectProperties: PropertyDefinition[] = [
    {
        key: 'label',
        label: '标签',
        type: 'string',
        defaultValue: '下拉选择',
        placeholder: '请输入标签名称',
    },
    {
        key: 'placeholder',
        label: '占位符',
        type: 'string',
        defaultValue: '请选择...',
        placeholder: '请输入占位符文本',
    },
    {
        key: 'width',
        label: '宽度',
        type: 'select',
        defaultValue: 'full',
        options: [
            { label: '100%', value: 'full' },
            { label: '50%', value: '1/2' },
            { label: '33%', value: '1/3' },
            { label: '25%', value: '1/4' },
        ],
    },
    {
        key: 'required',
        label: '必填',
        type: 'boolean',
        defaultValue: false,
    },
    {
        key: 'disabled',
        label: '禁用',
        type: 'boolean',
        defaultValue: false,
    },
];

// ============================================================================
// Renderer
// ============================================================================

function SelectRenderer(props: SelectComponentProps) {
    const { label, placeholder, options, required, disabled } = props;

    const displayOptions =
        options && options.length > 0
            ? options
            : [
                { label: '选项 1', value: 'option1' },
                { label: '选项 2', value: 'option2' },
                { label: '选项 3', value: 'option3' },
            ];

    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-1">
                {label}
                {required && <span className="text-destructive">*</span>}
            </Label>
            <Select disabled={disabled}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {displayOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

// ============================================================================
// Registration
// ============================================================================

const selectRegistration: ComponentRegistration = {
    type: 'select',
    category: 'basic',
    name: '下拉选择',
    icon: 'ChevronDown',
    description: '下拉选择框',
    defaultProps: {
        label: '下拉选择',
        placeholder: '请选择...',
        options: [
            { label: '选项 1', value: 'option1' },
            { label: '选项 2', value: 'option2' },
            { label: '选项 3', value: 'option3' },
        ],
        multiple: false,
        width: 'full',
        required: false,
        disabled: false,
    },
    properties: selectProperties,
};

registerComponent(selectRegistration, SelectRenderer as never);
