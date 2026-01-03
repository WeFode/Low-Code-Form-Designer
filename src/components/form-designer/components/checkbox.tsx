import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    type ComponentRegistration,
    type PropertyDefinition,
} from '@/types/form-designer';
import { registerComponent } from './registry';

// ============================================================================
// Properties Definition
// ============================================================================

export const checkboxProperties: PropertyDefinition[] = [
    {
        key: 'label',
        label: '标签',
        type: 'string',
        defaultValue: '复选组',
        placeholder: '请输入标签名称',
    },
    {
        key: 'orientation',
        label: '排列方向',
        type: 'select',
        defaultValue: 'vertical',
        options: [
            { label: '垂直', value: 'vertical' },
            { label: '水平', value: 'horizontal' },
        ],
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

function CheckboxRenderer(props: any) {
    const { label, options, orientation, required, disabled, id } = props;

    const displayOptions =
        options && options.length > 0
            ? options
            : [
                { label: '选项 1', value: 'option1' },
                { label: '选项 2', value: 'option2' },
            ];

    return (
        <div className="space-y-3">
            <Label className="flex items-center gap-1">
                {label}
                {required && <span className="text-destructive">*</span>}
            </Label>
            <div
                className={
                    orientation === 'horizontal'
                        ? 'flex flex-wrap gap-4'
                        : 'flex flex-col gap-3'
                }
            >
                {displayOptions.map((option: any) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                            id={`${id}-${option.value}`}
                            disabled={disabled}
                            className="transition-all duration-200"
                        />
                        <Label
                            htmlFor={`${id}-${option.value}`}
                            className="cursor-pointer text-sm font-normal"
                        >
                            {option.label}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// Registration
// ============================================================================

const checkboxRegistration: ComponentRegistration = {
    type: 'checkbox',
    category: 'basic',
    name: '复选框组',
    icon: 'CheckSquare',
    description: '多项选择组件',
    defaultProps: {
        label: '复选组',
        options: [
            { label: '选项 1', value: 'option1' },
            { label: '选项 2', value: 'option2' },
        ],
        orientation: 'vertical',
        width: 'full',
        required: false,
        disabled: false,
    },
    properties: checkboxProperties,
};

registerComponent(checkboxRegistration, CheckboxRenderer as never);
